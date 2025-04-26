# Backend Runner
import threading # Not sure

# Sensor Log Data
import time
from sensors.read_temp_humidity import read_temp_humidity
from sensors.read_tds import read_tds, set_temperature
from sensors.read_ph import read_ph, set_temperature as set_temp_ph
from loggers.firebase_logger import log_to_firebase, initialize_firebase

# Prediction Necessity
from firebase_admin import db
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, numpy as np, requests

# Load the model from folder1/model.pkl
model = joblib.load('prediction/model.pkl')

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Function to predict growth days using the model
def predict_days(data):
    features = np.array([[data["temperature"], data["humidity"], data["ph"], data["tds"]]])
    print("🔧 Features for prediction:", features)
    prediction = model.predict(features)
    print("📊 Raw model output:", prediction)
    predicted_days = float(prediction[0]) if prediction is not None else None
    return max(predicted_days, 0)  # Ensure non-negative prediction

FREQUENCY_SECONDS = 10  # Interval in seconds

def sensor_reading():
    initialize_firebase()

    while True:
        try:
            temp, humidity = read_temp_humidity()

            # Set temperature for TDS and ph compensation
            set_temperature(temp)
            set_temp_ph(temp)
            
            # Read sensor functions
            tds = read_tds()
            ph = read_ph()
            
            print(f"Temp: {temp:.2f} °C | Humidity: {humidity:.2f} % | TDS: {tds:.2f} ppm | pH: {ph:.2f}")

            payload = {
                "temperature": temp,    # avg_temp
                "humidity": humidity,   # avg_humidity
                "ph": ph,               # avg_ph
                "tds": tds              # avg_tds
            }

            API_URL = "http://localhost:5000/predict"
            response = requests.post(API_URL, json=payload, timeout = 5)

            if response.status_code == 200:
                # Log to Firebase
                log_to_firebase(temp, humidity, tds, ph)

            time.sleep(FREQUENCY_SECONDS)
            
        except Exception as e:
            print("Error:", e)
            time.sleep(5)

# API route to predict in batch from Firebase readings
@app.route("/predict", methods=["POST"])
def predictor():
    try:
        readings_ref = db.reference('sensor_logs')
        predictions_ref = db.reference('predictions')
        
        all_readings = readings_ref.get() or {}
        existing_predictions = predictions_ref.get() or {}

        # # Set of already predicted source IDs to skip duplicates
        predicted_ids = {entry.get("source_id") for entry in existing_predictions.values()}

        for reading_id, reading_data in all_readings.items():
            if reading_id in predicted_ids:
                continue  # skip already predicted

            predicted_days = predict_days(reading_data)

            # Save prediction to Firebase
            prediction_payload = {
                'source_id': reading_id,
                'humidity': reading_data.get('humidity'),
                'ph': reading_data.get('ph'),
                'tds': reading_data.get('tds'),
                'temperature': reading_data.get('temperature'),
                'predicted_days': round(predicted_days, 2),
                'timestamp': reading_data.get('timestamp')
            }
            predictions_ref.push(prediction_payload)

    except Exception as e:
        return jsonify({
            "status": f"Error: {str(e)}",
            "readings": {}
        }), 500
    
def backgroud_predict_checker():
    while True:
        try:
            predictor()
        except Exception as e:
            print("Error in background prediction: ", e)
        time.sleep(5)

if __name__ == "__main__":
    threading.Thread(target=sensor_reading, daemon=True).start()
    threading.Thread(target=backgroud_predict_checker, daemon=True).start()
    app.run(debug=True, host="0.0.0.0", port=5001)
    # main()
