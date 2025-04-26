import time
import board
import busio
from adafruit_ads1x15 import ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# === ADS1115 Setup ===
GAIN = 1  # ±4.096V range
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
ads.gain = GAIN

# === Analog Channel for pH Sensor ===
ph_chan = AnalogIn(ads, ADS.P3)  # A3 pin on ADS1115

# === Global temp override ===
_current_temp = 25.0  # Default to 25°C

def set_temperature(temp_c):
    """Set temperature for pH compensation externally."""
    global _current_temp
    _current_temp = temp_c

# === Voltage Averaging ===
def smoothed_voltage(channel, samples=20, delay=0.005):
    voltages = []
    for _ in range(samples):
        voltages.append(channel.voltage)
        time.sleep(delay)
    return round(sum(voltages) / len(voltages), 4)

# === pH Calculation ===
def read_ph():
    voltage = smoothed_voltage(ph_chan)
    print(f"[pH DEBUG] Voltage: {voltage:.4f} V | Temp: {_current_temp:.2f} °C")

    # ✅ Refined calibration for pH 4.16 @ 1.7966 V
    slope = 15.59
    intercept = -23.84

    ph_value = slope * voltage + intercept
    return round(ph_value, 2)

# === Test Loop ===
if __name__ == "__main__":
    print("DFRobot Analog pH Sensor v1.1 Monitoring Started")

    # You can override temp here manually (or use SHT30 in integration)
    set_temperature(30.6)

    try:
        while True:
            ph = read_ph()
            print(f"pH Value: {ph:.2f}\n")
            time.sleep(5)
    except KeyboardInterrupt:
        print("\nMonitoring stopped by user.")

