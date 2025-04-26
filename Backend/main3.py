from sensors.read_temp_humidity import read_temp_humidity
from sensors.read_tds import read_tds, set_temperature
from sensors.read_ph import read_ph, set_temperature as set_temp_ph
from loggers.firebase_logger import log_to_firebase, initialize_firebase
import time

from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction.predictors import predict_days

import threading # Not sure

FREQUENCY_SECONDS = 10  # Interval in seconds

def sensor_reading():
    initialize_firebase()

    # sensor_data = []  # Store all readings since the app started but apply it for mean parameters

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

            # Before Logging into Firebase, predict the growth day
                # # Add to historical list
                # sensor_data.append([temp, humidity, ph, tds])

                # # Compute mean of all readings so far
                # sensor_np = np.array(sensor_data)
                # avg_temp, avg_humidity, avg_ph, avg_tds = np.mean(sensor_np, axis=0)

            payload = {
                "temperature": temp,    # avg_temp
                "humidity": humidity,   # avg_humidity
                "pH": ph,               # avg_ph
                "tds": tds              # avg_tds
            }

            API_URL = "http://localhost:5000/predict"
            response = request.post(API_URL, json=payload, timeout = 5)

            if response.status_code == 200:
                result = response.json()
                predicted_days = result.get('prediction')

            # Log to Firebase
            log_to_firebase(temp, humidity, tds, ph, predicted_days)

            time.sleep(FREQUENCY_SECONDS)
            
        except Exception as e:
            print("Error:", e)
            time.sleep(5)

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict_days_endpoint():
    data = request.get_json()
    required_fields = ["temperature", "humidity", "pH", "tds"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing sensor fields"}), 400

    try:
        predicted_days = ml_predict_days(data)
        print("✅ Prediction complete.")
        return jsonify({
            "predicted_days": round(predicted_days, 2),
        })
    except Exception as e:
        print("❌ Prediction error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # sensor_thread = threading.Thread(target=sensor_loop, daemon=True)
    # sensor_thread.start()

    main()
