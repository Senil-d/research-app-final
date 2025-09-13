import sys
import json
import joblib
import pandas as pd
import os

# Get absolute path to current script directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model and encoders
model = joblib.load(os.path.join(BASE_DIR, 'model(predict-career)', 'suggested_career_model.pkl'))
stream_encoder = joblib.load(os.path.join(BASE_DIR, 'model(predict-career)', 'stream_encoder.pkl'))
spec_encoder = joblib.load(os.path.join(BASE_DIR, 'model(predict-career)', 'spec_encoder.pkl'))
career_mlb = joblib.load(os.path.join(BASE_DIR, 'model(predict-career)', 'career_mlb.pkl'))

def main():
    try:
        print("✅ Python model file started", file=sys.stderr)  # Confirmation print

        input_data = json.loads(sys.stdin.read())
        stream = input_data['stream']
        spec = input_data['specialization']

        # Encode inputs
        stream_enc = stream_encoder.transform([stream])[0]
        spec_enc = spec_encoder.transform([spec])[0]

        df_input = pd.DataFrame([{
            'stream_encoded': stream_enc,
            'spec_encoded': spec_enc
        }])

        # Predict
        prediction = model.predict(df_input)
        career_list = career_mlb.inverse_transform(prediction)[0]

        # Final output
        print(json.dumps({'predicted_career': career_list}))
        print("✅ Prediction completed successfully", file=sys.stderr)
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        print(f"❌ Error: {str(e)}", file=sys.stderr)

if __name__ == "__main__":
    main()
