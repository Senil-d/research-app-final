# import pandas as pd
# import sys
# import json
# import os

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# csv_path = os.path.join(BASE_DIR, "specialization_skill_detailed_table.csv")

# df = pd.read_csv(csv_path)

# specialization = sys.argv[1] if len(sys.argv) > 1 else ""
# skill = sys.argv[2] if len(sys.argv) > 2 else ""
# level = sys.argv[3] if len(sys.argv) > 3 else ""

# specialization = specialization.lower()
# skill = skill.lower()
# level = level.lower()

# filtered = df[
#     (df["Specialization"].str.lower() == specialization) &
#     (df["Skill"].str.lower() == skill)
# ]

# levels_to_include = []
# if level == "Beginner":
#     levels_to_include = ["Beginner", "Intermediate", "Advanced"]
# elif level == "Intermediate":
#     levels_to_include = ["Intermediate", "Advanced"]
# elif level == "Advanced":
#     levels_to_include = ["Advanced"]

# filtered = filtered[filtered["Level"].str.lower().isin(levels_to_include)]

# if not filtered.empty:
#     result = filtered.to_dict(orient="records")
#     output = {"success": True, "results": result}
# else:
#     output = {
#         "success": False,
#         "error": f"No results for specialization='{specialization}', skill='{skill}', level='{level}'"
#     }

# print(json.dumps(output, ensure_ascii=False))






# python/roadmap/load_resources.py
import pandas as pd
import sys
import json
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "specialization_skill_detailed_table.csv")

df = pd.read_csv(csv_path)

def normalize(s: str) -> str:
    s = str(s).strip().lower()
    s = s.replace("&", "and")
    s = s.replace("-", " ")
    s = re.sub(r"\s+", " ", s)  # collapse spaces
    return s

# Inputs
specialization = sys.argv[1] if len(sys.argv) > 1 else ""
skill = sys.argv[2] if len(sys.argv) > 2 else ""
level = sys.argv[3] if len(sys.argv) > 3 else ""

n_specialization = normalize(specialization)
n_skill = normalize(skill)
n_level = normalize(level)

# Normalized columns for robust matching
df["__spec_norm"] = df["Specialization"].astype(str).apply(normalize)
df["__skill_norm"] = df["Skill"].astype(str).apply(normalize)
df["__level_norm"] = df["Level"].astype(str).apply(normalize)

# Level inclusion logic
levels_to_include = []
if n_level == "beginner":
    levels_to_include = ["beginner", "intermediate", "advanced"]
elif n_level == "intermediate":
    levels_to_include = ["intermediate", "advanced"]
elif n_level == "advanced":
    levels_to_include = ["advanced"]
levels_to_include = [normalize(x) for x in levels_to_include]

filtered = df[
    (df["__spec_norm"] == n_specialization)
    & (df["__skill_norm"] == n_skill)
    & (df["__level_norm"].isin(levels_to_include))
]

# Optional: fallback to partial contains if exact not found
if filtered.empty:
    filtered = df[
        (df["__spec_norm"].str.contains(re.escape(n_specialization)))
        & (df["__skill_norm"].str.contains(re.escape(n_skill)))
        & (df["__level_norm"].isin(levels_to_include))
    ]

if not filtered.empty:
    # Return original columns (not the normalized)
    cols = [c for c in filtered.columns if not c.startswith("__")]
    result = filtered[cols].to_dict(orient="records")
    output = {"success": True, "results": result}
else:
    output = {
        "success": False,
        "error": f"No results for specialization='{n_specialization}', skill='{n_skill}', level='{n_level}'"
    }

print(json.dumps(output, ensure_ascii=False))
