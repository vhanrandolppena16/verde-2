import joblib
import numpy as np

# Load the model using joblib
model = joblib.load("./model.pkl")
# model_path = r"D:\vrsp11603\Technical Defense Application\manual_realtime_db\models\model.pkl"
# model = joblib.load("../models/model.pkl")

def predict_days(data):
    features = np.array(
        [[
            data["temperature"], 
            data["humidity"], 
            data["pH"], 
            data["tds"]]]
    )
    print("🔧 Features for prediction:", features)
    prediction = model.predict(features)
    print("📊 Raw model output:", prediction)

    # Use predicted days to determine growth stage
    predicted_days = float(prediction[0])  # This is the model's prediction / Can be deleted
    return float(prediction[0])

