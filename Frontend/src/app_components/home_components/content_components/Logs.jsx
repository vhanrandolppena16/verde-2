import React, { useEffect, useState, useRef } from "react";
import { ref, onValue, push } from "firebase/database";
import { rtdb } from "../../../firebase/firebase";

const THRESHOLDS = {
  temperature: { min: 18, max: 35 },
  humidity: { min: 40, max: 80 },
  ph: { min: 5.5, max: 7.5 },
  tds: { min: 600, max: 1200 },
};

const Logs = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState({}); // { parameter: ISOString }
  const lastResolvedKeyRef = useRef(""); // to prevent duplicate resolved alerts

  const checkAndTrack = (entry) => {
    const now = new Date();
    const updatedActiveAlerts = { ...activeAlerts };
    const newOutOfRange = [];
    const resolvedNow = [];
  
    Object.entries(THRESHOLDS).forEach(([param, range]) => {
      const val = parseFloat(entry[param]);
      if (isNaN(val)) return;
  
      const isOutOfRange = val < range.min || val > range.max;
  
      if (isOutOfRange) {
        if (!activeAlerts[param]) {
          // First time this param is out of range → record it
          updatedActiveAlerts[param] = now.toISOString();
          newOutOfRange.push({
            parameter: param,
            value: val,
            threshold: `${range.min}–${range.max}`,
          });
        }
      } else {
        // Came back in range
        if (activeAlerts[param]) {
          const start = new Date(activeAlerts[param]);
          const durationMin = Math.round((now - start) / 60000);
          resolvedNow.push({
            parameter: param,
            value: val,
            resolved: true,
            durationMinutes: durationMin,
            range: `${range.min}–${range.max}`,
          });
          delete updatedActiveAlerts[param];
        }
      }
    });
  
    // Log ONE alert only if there are new out-of-range parameters
    if (newOutOfRange.length > 0) {
      const alertEntry = {
        timestamp: now.toISOString(),
        issues: newOutOfRange,
        raw: entry,
      };
      setAlerts((prev) => [alertEntry, ...prev]);
      push(ref(rtdb, "alerts"), alertEntry);
    }
  
    // Log ONE grouped resolution only when something was resolved
    if (resolvedNow.length > 0) {
      const resolvedEntry = {
        timestamp: now.toISOString(),
        issues: resolvedNow,
        raw: entry,
        status: "resolved",
      };
      setAlerts((prev) => [resolvedEntry, ...prev]);
      push(ref(rtdb, "alerts"), resolvedEntry);
    }
  
    // Update state
    setActiveAlerts(updatedActiveAlerts);
  };
  
  useEffect(() => {
    const sensorRef = ref(rtdb, "sensor_logs");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const lastEntry = Object.values(rawData).pop(); // latest reading
        checkAndTrack(lastEntry);
      }
    });

    return () => unsubscribe();
  }, [activeAlerts]); // Still modify this

  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-red-700 mb-4">⚠️ Sensor Alerts</h2>
      <div className="max-h-[300px] overflow-y-auto pr-2">
        {alerts.length === 0 ? (
          <p className="text-gray-600">All parameters are within safe range.</p>
        ) : (
          <ul className="space-y-4">
            {alerts.slice(0, 6).map((alert, idx) => (
              <li
                key={idx}
                className={`${
                  alert.status === "resolved" ? "bg-green-100" : "bg-red-100"
                } border border-gray-300 p-4 rounded-md shadow-sm`}
              >
                <p className="font-semibold mb-1">
                  {alert.status === "resolved"
                    ? `✅ Resolved at ${new Date(alert.timestamp).toLocaleString()}`
                    : `⚠️ Alert at ${new Date(alert.timestamp).toLocaleString()}`}
                </p>
                <ul className="ml-4 list-disc text-sm">
                  {alert.issues.map((issue, i) => (
                    <li key={i}>
                      <strong>{issue.parameter.toUpperCase()}</strong>: {issue.value}{" "}
                      (Expected: {issue.threshold || issue.range})
                      {issue.resolved && (
                        <span className="text-green-800">
                          {" "}
                          — Out of range for {issue.durationMinutes} min
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Logs;
