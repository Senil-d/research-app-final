const express = require("express");
const { suggestResource } = require("../controllers/roadMapController");
const router = express.Router();

// POST /api/resources/suggest
router.post("/suggest", suggestResource);

module.exports = router;
