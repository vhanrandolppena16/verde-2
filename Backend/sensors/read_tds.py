import time
import board
import busio
from adafruit_ads1x15 import ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# === ADS1115 Setup ===
GAIN = 1
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
ads.gain = GAIN

# === Analog Channel for TDS Sensor ===
tds_chan = AnalogIn(ads, ADS.P2)  # A2 pin on ADS1115

# === Global temp override ===
_current_temp = 25.0  # Default temperature

def set_temperature(temp_c):
    """Set temperature for compensation externally (e.g., from temp sensor)."""
    global _current_temp
    _current_temp = temp_c

# === Smoothed Voltage Function ===
def smoothed_voltage(channel, samples=20, delay=0.005):
    readings = []
    for _ in range(samples):
        readings.append(channel.voltage)
        time.sleep(delay)
    return round(sum(readings) / len(readings), 4)

# === TDS Calculation ===
def read_tds():
    voltage = smoothed_voltage(tds_chan)

    print(f"[TDS DEBUG] Using temp compensation: {_current_temp:.2f} °C")

    compensation_coefficient = 1.0 + 0.02 * (_current_temp - 25.0)
    compensated_voltage = voltage / compensation_coefficient

    # Base ppm from voltage (before calibration)
    raw_tds = (133.42 * compensated_voltage**3
               - 255.86 * compensated_voltage**2
               + 857.39 * compensated_voltage) * 0.5

    # Apply correction multiplier (found by comparing to your TDS meter)
    correction_factor = 1.52  # 903 / 595 ≈ 1.52
    calibrated_tds = raw_tds * correction_factor

    return round(calibrated_tds, 1)

# === Test Loop ===
if __name__ == "__main__":
    print("DFRobot Analog TDS Sensor Standalone Monitor (with temp override)")
    
    # You can override temperature manually for testing (or use SHT30 in integration)
    set_temperature(30.6)  # Use real temperature for accurate TDS

    try:
        while True:
            tds_value = read_tds()
            print(f"TDS: {tds_value:.2f} ppm")
            time.sleep(5)
    except KeyboardInterrupt:
        print("\nMonitoring stopped by user.")

