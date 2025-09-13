import sys
import os
import dill
import json
import pandas as pd
import random

# Setup path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.adaptive_model import AdaptiveQuizSystem

# Load model from .pkl
model_path = os.path.join(os.path.dirname(__file__), '../model/adaptive_quiz_system_final.pkl')
with open(model_path, 'rb') as f:
    model = dill.load(f)

# ✅ Load dataset manually and assign to model.data
try:
    data_path = os.path.join(os.path.dirname(__file__), '../data/test_with_difficulty_lv-1.csv')
    df = pd.read_csv(data_path)
    model.data = df.to_dict(orient='records')  # ✅ Assign dataset to self.data
except Exception as e:
    print(json.dumps({"error": f"Failed to load question dataset: {str(e)}"}))
    sys.exit(1)

# Generate 20 questions
def main():
    try:
        questions = model.generate_questions(num_questions=20)
        print(json.dumps(questions))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    main()
