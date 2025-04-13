import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../../../firebase/firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PARAMS = [
  { key: "temperature", label: "Temperature (°C)" },
  { key: "humidity", label: "Humidity (%)" },
  { key: "ph", label: "pH" },
  { key: "tds", label: "TDS (ppm)" },
];

const SensorGraph = () => {
  const [sensorData, setSensorData] = useState([]);
  const [selectedParams, setSelectedParams] = useState(["temperature"]);
  const [multiSelect, setMultiSelect] = useState(false);

  useEffect(() => {
    const sensorRef = ref(rtdb, "sensor_logs");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const parsedData = Object.entries(rawData).map(([id, entry]) => ({
          id,
          ...entry,
          timestamp: new Date(entry.timestamp).toLocaleString(),
        }));

        const sortedData = parsedData.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        setSensorData(sortedData);
      } else {
        setSensorData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleParam = (key) => {
    if (multiSelect) {
      // Toggle on/off
      setSelectedParams((prev) =>
        prev.includes(key)
          ? prev.filter((param) => param !== key)
          : [...prev, key]
      );
    } else {
      // Single select mode
      setSelectedParams([key]);
    }
  };

  const getGridCols = (count) => {
    if (count === 1 || count === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sensor Data Graph</h2>
        <button
          className={`px-4 py-2 rounded shadow ${
            multiSelect ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
          onClick={() => {
            setMultiSelect((prev) => !prev);
            setSelectedParams(["temperature"]); // reset selection to default
          }}
        >
          {multiSelect ? "Multiple Select" : "Single Select"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 ">
        {PARAMS.map((param) => (
          <button
            key={param.key}
            onClick={() => toggleParam(param.key)}
            className={`px-4 py-2 rounded shadow transition ${
              selectedParams.includes(param.key)
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {param.label}
          </button>
        ))}
      </div>

      {/* Graph Grid */}
      <div
        className={`grid gap-6 ${
          selectedParams.length === 1
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2"
        }`}
>        {selectedParams.map((key) => {
          const label = PARAMS.find((p) => p.key === key)?.label;
          return (
            <div
              className="bg-white rounded-xl shadow p-4 w-full min-h-[300px] max-h-[350px] flex flex-col"
              key={key}
            >
              <h3 className="text-md font-semibold mb-2">{label}</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" minTickGap={40} />
                    <YAxis
                      label={{
                        value: label,
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={key}
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorGraph;
