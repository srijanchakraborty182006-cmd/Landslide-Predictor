from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

scaler = joblib.load('scaler.pkl')
model = joblib.load('landslide_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        raw_features = data['features']
        input_array = np.array([raw_features])
        scaled_Features = scaler.transform(input_array)
        probabilities = model.predict_proba(scaled_Features)
        landslide_risk = float(probabilities[0][1] * 100)
        return jsonify({
            'status' : 'success',
            'risk_percentage' : round(landslide_risk, 2)
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)