import sys
import json
import os
import pandas as pd

# === Load dataset ===
csv_path = os.path.join(os.path.dirname(__file__), "analytical_quiz_dataset.csv")
df = pd.read_csv(csv_path)

# ✅ Ensure options column is split into a list
df["options"] = df["options"].apply(lambda x: str(x).split(";"))

# === Read user answers from Node.js ===
input_data = json.loads(sys.stdin.read() or "{}")
user_answers = input_data.get("answers", {})       # { "qid": "user_selected_option_text" }
total_expected = input_data.get("total_questions", None)

# === Supported skills (categories from dataset) ===
available_skills = df["category"].unique().tolist()
score_map = {k: 0 for k in available_skills}
total_map = {k: 0 for k in available_skills}

correct_total = 0
answered_total = 0

print("DEBUG - user_answers:", user_answers, file=sys.stderr)

# === Evaluate answers ===
for qid_str, user_ans in user_answers.items():
    row = df[df["id"].astype(str) == str(qid_str)]
    if row.empty:
        print(f"[WARN] No row found for question_id={qid_str}", file=sys.stderr)
        continue

    row = row.iloc[0]
    skill = row.get("category", "")
    if skill not in total_map:
        continue

    total_map[skill] += 1
    answered_total += 1

    # Normalize both values for fair comparison
    user_ans_norm = str(user_ans).strip().lower()
    correct_ans_norm = str(row.get("answer", "")).strip().lower()

    print(f"DEBUG qid={qid_str}, user={user_ans_norm}, correct={correct_ans_norm}", file=sys.stderr)

    if user_ans_norm == correct_ans_norm:
        score_map[skill] += 1
        correct_total += 1

# === Build skill profile (percentages) ===
skill_profile = {}
for skill, correct in score_map.items():
    total = total_map[skill]
    skill_profile[skill] = int((correct / total) * 100) if total > 0 else 0

# === Overall score ===
valid_sections = [v for k, v in skill_profile.items() if total_map[k] > 0]
avg_score = sum(valid_sections) / len(valid_sections) if valid_sections else 0

# === Completion rate ===
if total_expected is None:
    total_expected = answered_total
completion_rate = int((answered_total / total_expected) * 100) if total_expected else 0

# === Level ===
if avg_score >= 80:
    level = "Advanced"
elif avg_score >= 50:
    level = "Intermediate"
else:
    level = "Beginner"

# === Final result ===
result = {
    "final_level": level,
    "overall_score": int(avg_score),
    "completion_rate": completion_rate,
    "skill_profile": skill_profile,
    "correct_count": int(correct_total),
    "total_questions": int(total_expected),
}

print(json.dumps(result))
