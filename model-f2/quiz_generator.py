# quiz_generator.py (for analytical_quiz_dataset.csv)
import json
import random
import pandas as pd
import os

# Load dataset
csv_path = os.path.join(os.path.dirname(__file__), "analytical_quiz_dataset.csv")
df = pd.read_csv(csv_path)

# ✅ Drop rows with missing values
df = df.dropna(subset=["id", "category", "difficulty", "question", "options", "answer"])

# ✅ Remove duplicates
df = df.drop_duplicates(subset=["question", "category"])

# ✅ Split options column into a list
df["options"] = df["options"].apply(lambda x: str(x).split(";"))

# ✅ Random sample per category
categories = ["data_interpretation", "pattern_recognition", "statistics"]
final_questions = []

for cat in categories:
    cat_df = df[df["category"] == cat]
    if len(cat_df) >= 5:
        sampled = cat_df.sample(n=5, random_state=random.randint(1, 10000))
    else:
        sampled = cat_df
    final_questions.extend(sampled.to_dict(orient="records"))

# ✅ Format output
formatted = []
for q in final_questions:
    formatted.append({
        "id": str(q["id"]),                   # use dataset id
        "question_text": q["question"],       # question text
        "options": q["options"],              # list of options
        "category": q["category"],            # category for grouping
        "difficulty": q["difficulty"]
        # ❌ do not send "answer" to frontend
    })

# ✅ Print JSON to stdout
print(json.dumps(formatted))
