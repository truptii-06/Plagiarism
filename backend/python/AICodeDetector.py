import sys
import os
import json
import joblib
import pandas as pd

# Add current directory to path to find modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules.stylometric_analysis import extract_features

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)

    file_path = sys.argv[1]

    if not os.path.exists(file_path):
        print(json.dumps({"error": f"File not found: {file_path}"}))
        sys.exit(1)

    try:
        # Determine extension
        _, ext = os.path.splitext(file_path)
        extension = ext.lstrip(".").lower()
        
        # Default to py if unknown, or maybe handle error? 
        # The extract_features supports 'py' and 'java'.
        if extension not in ['py', 'java']:
             # Fallback to py or just proceed
             pass

        with open(file_path, "r", encoding="utf-8") as f:
            code_content = f.read()

        # Load model
        model_path = os.path.join(os.path.dirname(__file__), "stylometric_model.pkl")
        if not os.path.exists(model_path):
            print(json.dumps({"error": "Model file not found"}))
            sys.exit(1)

        model = joblib.load(model_path)

        # Extract features
        features = extract_features(code_content, extension=extension)
        features_df = pd.DataFrame([features])

        # Predict
        prediction = model.predict(features_df)[0]
        proba = model.predict_proba(features_df)[0]
        classes = model.classes_
        
        pred_index = list(classes).index(prediction)
        confidence = float(proba[pred_index] * 100)

        result = {
            "status": "success",
            "prediction": prediction, # "AI" or "Human"
            "confidence": confidence,
            "classes": list(classes),
            "probabilities": list(proba)
        }
        
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
