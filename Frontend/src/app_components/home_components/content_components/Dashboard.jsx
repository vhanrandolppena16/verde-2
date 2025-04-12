// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Gauge from "./dashboard_component/Gauge";
import { rtdb } from "../../../firebase/firebase"; // Make sure the path is correct
import GrowthStage from "../../../assets/images/lettuce-growing-timeline.png";
import { ref, onValue } from "firebase/database"; // Import Firebase database functions

import SensorReadings from "./dashboard_component/GaugeDisplay";
import PredictionStage from "./dashboard_component/PredictionStage";
import CameraFeed from "./dashboard_component/DashboardCamFeed";

const Dashboard = () => {
  const [temperaturevalue, setTemperature] = useState(0);
  const [humidityvalue, setHumidity] = useState(0);
  const [pHvalue, setPH] = useState(0);
  const [tdsvalue, setTDS] = useState(0);

  useEffect(() => {
    const readingsRef = ref(rtdb, "sensor_logs");

    onValue(readingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const latestReadingId = Object.keys(data)[Object.keys(data).length - 1];
        const latestReading = data[latestReadingId];

        setTemperature(latestReading.temperature);
        setHumidity(latestReading.humidity);
        setPH(latestReading.ph);
        setTDS(latestReading.tds);
      }
    });

    return () => {};
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6 min-h-[620px]">
      <SensorReadings
        temperature={temperaturevalue}
        humidity={humidityvalue}
        pH={pHvalue}
        tds={tdsvalue}
      />
      <div className="flex flex-col gap-6">
        <PredictionStage />
        <CameraFeed />
      </div>
    </div>
  );
};

  export default Dashboard;