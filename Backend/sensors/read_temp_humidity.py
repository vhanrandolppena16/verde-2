import time
import board
import busio
from adafruit_ads1x15 import ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# === ADS1115 Setup ===
GAIN = 1  # ±4.096V for 5V sensors
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
ads.gain = GAIN

# === Analog Channels ===
temp_chan = AnalogIn(ads, ADS.P0)
humidity_chan = AnalogIn(ads, ADS.P1)

# === Adaptive EMA Voltage Smoothing ===
def adaptive_ema(channel, alpha_rise=0.2, alpha_fall=0.05, samples=100, delay=0.002):
    voltage = channel.voltage
    ema = voltage
    for _ in range(samples - 1):
        time.sleep(delay)
        new = channel.voltage
        alpha = alpha_rise if new > ema else alpha_fall
        ema = alpha * new + (1 - alpha) * ema
    return round(ema, 4)

def read_temperature(voltage):
    if voltage < 1.18:
        temp_c = (voltage - 1.10) * 140 + 20
    elif voltage >= 1.32:
        temp_c = (voltage - 1.35) * 8.5 + 30.6  # FINAL nudge for accurate match
    else:
        temp_c = (voltage - 1.23) * 100 + 27

   # print(f"[TEMP DEBUG] voltage={voltage:.4f} → temp={temp_c:.2f} °C")
    return temp_c, temp_c * 9 / 5 + 32

# === Final Humidity Calibration (target: ~70% RH at ~1.993V) ===
def read_humidity(voltage):
    rh = voltage * 80 - 89.5  # Adjusted slope & intercept
    return min(max(rh, 0), 100)

# === Smoothed RH Output ===
last_rh_smoothed = None
def smooth_rh(rh, alpha=0.2):
    global last_rh_smoothed
    if last_rh_smoothed is None:
        last_rh_smoothed = rh
    else:
        last_rh_smoothed = alpha * rh + (1 - alpha) * last_rh_smoothed
    return round(last_rh_smoothed, 1)

# === Optional Clamp for Temp Spikes ===
last_temp = None
def filter_readings(temp_c, rh):
    global last_temp
    if last_temp is not None and abs(temp_c - last_temp) > 4:
        temp_c = last_temp
    last_temp = temp_c
    return round(temp_c, 1), round(rh, 1)

# === Sensor Read Function ===
def read_temp_humidity():
    temp_voltage = adaptive_ema(temp_chan)
    humidity_voltage = adaptive_ema(humidity_chan)

    temp_c, _ = read_temperature(temp_voltage)
    rh_raw = read_humidity(humidity_voltage)
    rh = smooth_rh(rh_raw)

    temp_c, rh = filter_readings(temp_c, rh)

    # print(f"Temp Voltage: {temp_voltage:.4f} V | Humidity Voltage: {humidity_voltage:.4f} V")
    return temp_c, rh

# === Main Loop ===
if __name__ == "__main__":
    print("SHT30 (Analog, 5V-powered) Sensor Monitoring Started (Fully Calibrated)")

    try:
        while True:
            temp, humidity = read_temp_humidity()
            print(f"Temperature: {temp:.1f} °C")
            print(f"Humidity: {humidity:.1f} %RH\n")
            time.sleep(2)
    except KeyboardInterrupt:
        print("\nMonitoring stopped by user. Exiting cleanly...")

