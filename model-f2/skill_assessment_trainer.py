# models/skill_assessment_trainer.py

import pandas as pd
import dill
import os
from sklearn.preprocessing import LabelEncoder

# === Load Data ===
csv_path = os.path.join(os.path.dirname(__file__), 'skill_assessment_questions_full.csv')
df = pd.read_csv(csv_path)

# === Clean & Prepare Data ===
df = df[df['skill_area'].isin(['data_interpretation', 'pattern_recognition', 'statistics'])]
df = df.dropna(subset=['options', 'correct_answer', 'question_text'])

# === Encode Labels ===
le = LabelEncoder()
df['correct_answer_encoded'] = le.fit_transform(df['correct_answer'])

# === Feature Engineering ===
def compute_weights(row):
    skill_weights = {
        'data_interpretation': 1.1,
        'pattern_recognition': 1.0,
        'statistics': 1.2
    }
    difficulty_weights = {
        'easy': 1,
        'medium': 1.5,
        'hard': 2
    }
    return skill_weights.get(row['skill_area'], 1.0) * difficulty_weights.get(row['difficulty'], 1)

df['question_weight'] = df.apply(compute_weights, axis=1)


# === Add Unique ID ===
df = df.reset_index(drop=True)
df["question_id"] = df.index + 1  # Start IDs from 

# === Save Trained Data as Model ===
output_path = os.path.join(os.path.dirname(__file__), 'skill_assessment_model.pkl')
with open(output_path, 'wb') as f:
    dill.dump(df, f)

print("✅ Model trained and saved as skill_assessment_model.pkl")
