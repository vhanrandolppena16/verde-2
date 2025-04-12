import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from "../../../firebase/firebase";

const GROWTH_DURATION_DAYS = 30;

const getGrowthStage = (days) => {
  if (days < 7) return "Germination";
  if (days < 14) return "Seeding";
  if (days < 21) return "Vegetative";
  if (days < 28) return "Mature";
  return "Harvest";
};

const SensorTable = () => {
  const [sensorData, setSensorData] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const saved = localStorage.getItem('plantStartDate');
    return saved ? new Date(saved) : new Date();
  });

  useEffect(() => {
    const sensorRef = ref(rtdb, 'sensor_logs');
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const parsedData = Object.entries(rawData).map(([id, entry]) => ({
          id,
          ...entry,
          timestampObj: new Date(entry.timestamp)
        }));
        setSensorData(parsedData);
      } else {
        setSensorData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResetStartDate = () => {
    const now = new Date();
    localStorage.setItem('plantStartDate', now.toISOString());
    setStartDate(now);
  };

  return (
    <div className="w-full h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sensor Readings Table</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
          onClick={handleResetStartDate}
        >
          Reset Growth Start
        </button>
      </div>

      <div className="relative overflow-auto max-h-[500px] rounded-xl shadow bg-white">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="text-left py-2 px-4 w-[200px]">Timestamp</th>
              <th className="text-left py-2 px-4 w-[160px]">Temperature (°C)</th>
              <th className="text-left py-2 px-4 w-[140px]">Humidity (%)</th>
              <th className="text-left py-2 px-4 w-[100px]">pH</th>
              <th className="text-left py-2 px-4 w-[140px]">TDS (ppm)</th>
              <th className="text-left py-2 px-4 w-[100px]">Day #</th>
              <th className="text-left py-2 px-4 w-[140px]">Growth Stage</th>
              <th className="text-left py-2 px-4 w-[200px]">Predicted Maturity (Days)</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((entry) => {
              const dayNum = Math.floor(
                (entry.timestampObj - startDate) / (1000 * 60 * 60 * 24)
              );
              return (
                <tr key={entry.id} className="border-t">
                  <td className="py-2 px-4">{entry.timestamp}</td>
                  <td className="py-2 px-4">{entry.temperature}</td>
                  <td className="py-2 px-4">{entry.humidity}</td>
                  <td className="py-2 px-4">{entry.ph}</td>
                  <td className="py-2 px-4">{entry.tds}</td>
                  <td className="py-2 px-4">{dayNum >= 0 ? dayNum : 0}</td>
                  <td className="py-2 px-4">{getGrowthStage(dayNum)}</td>
                  <td className="py-2 px-4">{GROWTH_DURATION_DAYS}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorTable;
