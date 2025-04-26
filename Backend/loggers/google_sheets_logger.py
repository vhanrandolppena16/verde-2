import gspread
from oauth2client.service_account import ServiceAccountCredentials
import datetime

# === CONFIGURATION ===
GDOCS_OAUTH_JSON = 'google-auth.json'  # Path to your credentials file
GDOCS_SPREADSHEET_NAME = 'Sensor_data'  # Your Google Sheets name

# === Google Sheets Setup ===
scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]

creds = ServiceAccountCredentials.from_json_keyfile_name(GDOCS_OAUTH_JSON, scope)
client = gspread.authorize(creds)
sheet = client.open(GDOCS_SPREADSHEET_NAME).sheet1

def initialize_sheet():
    """Ensure headers exist at the top of the sheet.""" 
    headers = ["Timestamp", "Temperature (°C)", "Humidity (%)", "TDS (ppm)", "pH"]
    existing = sheet.row_values(1)
    if existing != headers:
        sheet.insert_row(headers, index=1)

def log_to_sheet(temp, humidity, tds, ph):
    """Append a new row of sensor data to the sheet."""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    row = [timestamp, round(temp, 2), round(humidity, 2), round(tds, 2), round(ph,2)] 
    sheet.append_row(row)
    


