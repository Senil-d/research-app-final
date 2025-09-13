import sys
import json
import dill
import os

# Load model (which is the dataframe)
model_path = os.path.join(os.path.dirname(__file__), '../data/skill_assessment_model.pkl')
with open(model_path, 'rb') as f:
    df = dill.load(f)

# Read user answers
input_data = json.loads(sys.stdin.read())
user_answers = input_data["answers"]

# ✅ Only use skill areas available in the dataset
# ✅ Use only supported skills
available_skills = ["data_interpretation", "pattern_recognition", "case_study"]

score_map = {skill: 0 for skill in available_skills}
total_map = {skill: 0 for skill in available_skills}

# Evaluate answers
for qid, user_ans in user_answers.items():
    try:
        row = df[df["question_id"] == int(qid)].iloc[0]
        skill = row["skill_area"]
        total_map[skill] += 1
        if row["correct_answer"] == user_ans:
            score_map[skill] += 1
    except Exception as e:
        print(f"Error on qid={qid}: {e}", file=sys.stderr)
        continue

# Compute skill profile percentages
skill_profile = {
    skill: int((score / total_map[skill]) * 100) if total_map[skill] > 0 else 0
    for skill, score in score_map.items()
}

# Calculate overall average score
avg_score = sum(skill_profile.values()) / len(skill_profile) if skill_profile else 0

# Determine level
if avg_score >= 80:
    level = "Advanced"
elif avg_score >= 50:
    level = "Intermediate"
else:
    level = "Beginner"

# Final result
result = {
    "final_level": level,
    "overall_score": int(avg_score),
    "completion_rate": 100,  # You can make this dynamic later
    "skill_profile": skill_profile
}

print(json.dumps(result))
