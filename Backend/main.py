from sensors.read_temp_humidity import read_temp_humidity
from sensors.read_tds import read_tds, set_temperature
from sensors.read_ph import read_ph, set_temperature as set_temp_ph
import time

from RPLCD.i2c import CharLCD

# === LCD Setup ===
lcd = CharLCD(i2c_expander='PCF8574', address=0x27, port=1,
              cols=16, rows=2, charmap='A00', auto_linebreaks=True)

FREQUENCY_SECONDS = 5

def main():
    try:
        lcd.clear()
        lcd.write_string("Hydroponics Init")
        time.sleep(2)

        while True:
            temp, humidity = read_temp_humidity()
            set_temperature(temp)
            set_temp_ph(temp)

            tds = read_tds()
            ph = read_ph()

            # Debug to console
            print(f"Temp: {temp:.2f} °C | RH: {humidity:.2f} % | TDS: {tds:.2f} ppm | pH: {ph:.2f}")

            # === LCD Display ===
            lcd.clear()
            lcd.write_string(f"T:{temp:.1f}C H:{humidity:.0f}%")
            lcd.cursor_pos = (1, 0)
            lcd.write_string(f"TDS:{int(tds)} pH:{ph:.2f}")

            time.sleep(FREQUENCY_SECONDS)

    except KeyboardInterrupt:
        lcd.clear()
        lcd.write_string("System has stopped")
        print("\nStopped by user.")

if __name__ == "__main__":
    main()

