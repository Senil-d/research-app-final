const path = require("path");
const { spawn } = require("child_process");
const jwt = require("jsonwebtoken");

const suggestResource = async (req, res) => {
  try {
    // Token (optional if body has everything)
    const authHeader = req.headers.authorization || "";
    const hasBearer = authHeader.startsWith("Bearer ");
    const decoded = hasBearer
      ? jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET)
      : {};

    // Allow body to override token
    const bodySpec = (req.body?.specialization || "").trim();
    const bodySkill = (req.body?.skill || "").trim();
    const bodyLevel = (req.body?.level || "").trim();

    const specialization = bodySpec || decoded.specialization || "";
    const skill = bodySkill || decoded.skill || "";
    const level = bodyLevel || decoded.level || "";

    if (!specialization || !skill || !level) {
      return res.status(400).json({
        error:
          "Missing inputs. Provide specialization, skill, and level either in body or via JWT.",
        got: { specialization, skill, level },
      });
    }

    const pyPath = path.join(__dirname, "../python/roadmap/load_resources.py");
    const pyProcess = spawn("python3", [pyPath, specialization, skill, level]);

    let data = "";
    let error = "";

    pyProcess.stdout.on("data", chunk => (data += chunk.toString()));
    pyProcess.stderr.on("data", chunk => (error += chunk.toString()));

    pyProcess.on("close", code => {
      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed", detail: error });
      }
      try {
        const result = JSON.parse(data);
        return res.json(result);
      } catch (e) {
        return res.status(500).json({ error: "Invalid JSON from Python", detail: data });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", detail: err.message });
  }
};

module.exports = { suggestResource };
