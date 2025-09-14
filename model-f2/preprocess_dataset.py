import pandas as pd
import dill
import os

# Load dataset
csv_path = os.path.join(os.path.dirname(__file__), "Full_Skill_Assessment_Quiz_Dataset.csv")
df = pd.read_csv(csv_path)

# Add stable question_id (1, 2, 3, …)
df.insert(0, "question_id", range(1, len(df) + 1))

# Save new CSV
df.to_csv("Full_Skill_Assessment_Quiz_Dataset_with_id.csv", index=False)

# Save dill for evaluator
with open("skill_assessment_model.pkl", "wb") as f:
    dill.dump(df, f)

print("✅ Added question_id to dataset and updated dill model")
