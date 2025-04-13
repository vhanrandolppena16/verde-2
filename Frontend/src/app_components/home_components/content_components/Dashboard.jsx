// src/components/Dashboard.jsx
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { rtdb } from "../../../firebase/firebase"; // Make sure the path is correct
import { ref, onValue } from "firebase/database"; // Import Firebase database functions

import SensorReadings from "./dashboard_component/GaugeDisplay";
import PredictionStage from "./dashboard_component/PredictionStage";
import CameraFeed from "./dashboard_component/DashboardCamFeed";
import LiveStreamPage from "./LiveStream";

const Dashboard = () => {
  const [temperaturevalue, setTemperature] = useState(null);
  const [humidityvalue, setHumidity] = useState(null);
  const [pHvalue, setPH] = useState(null);
  const [tdsvalue, setTDS] = useState(null);

  useEffect(() => {
    document.title = "Dashboard | Verde";
  }, []);

  useEffect(() => {
    const readingsRef = ref(rtdb, "readings");

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
      <div className="flex flex-col gap-4 h-full max-h-[620px]">
  <div className="flex-1">
    <PredictionStage />
  </div>
  <Link to="/livestream" className="flex-1 block">
    <div className="w-full h-full cursor-pointer">
      <LiveStreamPage showControls={false} />
    </div>
  </Link>
</div>

    </div>
  );
};

  export default Dashboard;