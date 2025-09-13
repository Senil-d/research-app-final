# quiz_generator.py (Final version for Full_Skill_Assessment_Quiz_Dataset.csv)
import json
import random
import pandas as pd
import os

# Load dataset
csv_path = os.path.join(os.path.dirname(__file__), "../data/Full_Skill_Assessment_Quiz_Dataset.csv")
df = pd.read_csv(csv_path)

# ✅ Rename for consistency
df.rename(columns={"category": "skill_area"}, inplace=True)

# ✅ Drop rows with missing fields
df = df.dropna(subset=["question_text", "option_A", "option_B", "option_C", "option_D", "correct_answer", "skill_area", "difficulty"])

# ✅ Remove duplicates
df = df.drop_duplicates(subset=["question_text", "skill_area"])

# ✅ Combine options into a list
def build_options(row):
    return [row["option_A"], row["option_B"], row["option_C"], row["option_D"]]

df["options"] = df.apply(build_options, axis=1)

# ✅ Random sample per category
categories = ["data_interpretation", "pattern_recognition", "case_study"]
final_questions = []

for cat in categories:
    cat_df = df[df["skill_area"] == cat]
    if len(cat_df) >= 5:
        sampled = cat_df.sample(n=5, random_state=random.randint(1, 10000))
    else:
        sampled = cat_df
    final_questions.extend(sampled.to_dict(orient="records"))

# ✅ Format output
formatted = []
for i, q in enumerate(final_questions):
    formatted.append({
        "id": i + 1,
        "question_text": q["question_text"],
        "options": q["options"],
        "correct_answer": q["correct_answer"],
        "category": q["skill_area"],  # frontend key
        "difficulty": q["difficulty"]
    })

# ✅ Output JSON to stdout
print(json.dumps(formatted))
