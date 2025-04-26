import firebase_admin
from firebase_admin import credentials, db
import time

# One-time Firebase setup
def initialize_firebase():
    cred = credentials.Certificate("FirebaseSecureAccountKey.json")  # Path to your JSON key
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://team48-verde-995e4-default-rtdb.asia-southeast1.firebasedatabase.app/'
    })

# Function to log data
def log_to_firebase(temp, humidity, tds, ph, predicted_days):
    ref = db.reference('/readings') # Full data
    data = {
        'temperature': round(temp, 2),
        'humidity': round(humidity, 2),
        'tds' : round(tds, 2),
        'ph' : round(ph, 2),
        'timestamp': time.strftime("%Y-%m-%d %H:%M:%S")
    }
    ref.push(data)

    # ref_pred = db.reference('/full_data') # Full data
    # pred_data = {
    #     'temperature': round(temp, 2),
    #     'humidity': round(humidity, 2),
    #     'tds' : round(tds, 2),
    #     'ph' : round(ph, 2),
    #     'predicted_days' : round(predicted_days, 2),
    #     'timestamp': time.strftime("%Y-%m-%d %H:%M:%S")
    # }
    # ref_pred.push(pred_data)


