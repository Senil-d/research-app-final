import sys
import json
import joblib
import pandas as pd
import os

# ✅ Define class exactly as when it was saved
class CareerSkillModel:
    def __init__(self, csv_path=None):
        self.df = pd.read_csv(csv_path) if csv_path else None

    def predict(self, career_name):
        row = self.df[self.df['Career'].str.lower() == career_name.lower()]
        if row.empty:
            return {
                "error": f"No data found for career: {career_name}"
            }

        skills = {}
        for skill in ['Problem-Solving', 'Analytical', 'Artistic', 'Leadership']:
            val = row.iloc[0][skill]
            if pd.notna(val):
                skills[skill] = val

        justification = row.iloc[0]['Justification']
        return {
            "career":career_name,
            "Required Skills": skills,
            "Justification": justification
        }

# ✅ Load model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'model(predict-career)', 'required_career_skill_model.pkl')

career_skill_model = joblib.load(model_path)

# ✅ Main entry
def main():
    try:
        print("✅ Career skill model started", file=sys.stderr)

        # Read input JSON from stdin
        input_data = json.loads(sys.stdin.read())
        career = input_data.get("career")

        if not career:
            print(json.dumps({"error": "Career is required"}))
            return

        result = career_skill_model.predict(career)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
