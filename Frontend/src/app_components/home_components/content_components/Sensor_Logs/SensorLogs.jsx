// React imports for hooks
import React, { useEffect, useState, useRef } from "react";
// Firebase functions for realtime database interaction
import { ref, onValue, push } from "firebase/database";
// Firebase DB reference (custom config)
import { sensor_db } from "../../../../Firebase Database/FirebaseConfig";

// Modify the logs to Modal
// Display Log History
// Include COntrol

// Safe threshold ranges for each sensor parameter
const THRESHOLDS = {
  temperature: { min: 18, max: 35 }, // °C
  humidity: { min: 40, max: 80 },    // %
  ph: { min: 5.5, max: 7.5 },        // pH scale
  tds: { min: 800, max: 1600 },      // ppm
};

const Logs = () => {
  const [alerts, setAlerts] = useState([]); // List of current and past alerts
  const [activeAlerts, setActiveAlerts] = useState({}); // Tracks which parameters are currently out of range
  const lastResolvedKeyRef = useRef(""); // Optional: for debouncing/resolving duplicates (currently unused)

  // Main function to detect new alerts or resolve old ones
  const checkAndTrack = (entry) => {
    const now = new Date(); // current timestamp
    const updatedActiveAlerts = { ...activeAlerts }; // copy current alerts
    const newOutOfRange = []; // new issues to log
    const resolvedNow = [];   // resolved issues to log

    // Loop through all parameters and check if values are within defined thresholds
    Object.entries(THRESHOLDS).forEach(([param, range]) => {
      const val = parseFloat(entry[param]); // get the latest value
      if (isNaN(val)) return; // skip if not a number

      const isOutOfRange = val < range.min || val > range.max;

      if (isOutOfRange) {
        // If not previously alerted, mark it as a new alert
        if (!activeAlerts[param]) {
          updatedActiveAlerts[param] = now.toISOString();
          newOutOfRange.push({
            parameter: param,
            value: val,
            threshold: `${range.min}–${range.max}`,
          });
        }
      } else {
        // If previously out of range but now normal, log resolution
        if (activeAlerts[param]) {
          const start = new Date(activeAlerts[param]);
          const durationMin = Math.round((now - start) / 60000); // duration in minutes
          resolvedNow.push({
            parameter: param,
            value: val,
            resolved: true,
            durationMinutes: durationMin,
            range: `${range.min}–${range.max}`,
          });
          delete updatedActiveAlerts[param]; // remove from active alerts
        }
      }
    });

    // If there are new alerts, log one grouped alert entry
    if (newOutOfRange.length > 0) {
      const alertEntry = {
        timestamp: now.toISOString(),
        issues: newOutOfRange,
        raw: entry,
      };
      setAlerts((prev) => [alertEntry, ...prev]); // update UI
      push(ref(sensor_db, "alerts"), alertEntry); // push to Firebase
    }

    // If any parameters have resolved, log one grouped resolution entry
    if (resolvedNow.length > 0) {
      const resolvedEntry = {
        timestamp: now.toISOString(),
        issues: resolvedNow,
        raw: entry,
        status: "resolved",
      };
      setAlerts((prev) => [resolvedEntry, ...prev]);
      push(ref(sensor_db, "alerts"), resolvedEntry);
    }

    // Update the active alerts state
    setActiveAlerts(updatedActiveAlerts);
  };

  const rerunCountRef = useRef(0); // Tracks how many times effect ran

  useEffect(() => {
    if (rerunCountRef.current >= 3) return; // Stop after 3 runs
  
    // Increment the rerun count
    rerunCountRef.current += 1;
  
    const sensorRef = ref(sensor_db, "predictions"); // reference to sensor data
  
    // Set up a realtime listener
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const lastEntry = Object.values(rawData).pop(); // get the most recent reading
        checkAndTrack(lastEntry); // evaluate the reading
      }
    });
  
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [activeAlerts]); // Effect will only run 3 times max
  
  // JSX to display the alerts section
  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-red-700 mb-4">⚠️ Sensor Alerts</h2>
      <div className="max-h-[300px] overflow-y-auto pr-2">
        {alerts.length === 0 ? (
          // No alerts → display neutral message
          <p className="text-gray-600">All parameters are within safe range.</p>
        ) : (
          // Display the last 6 alerts
          <ul className="space-y-4">
            {alerts.slice(0, 6).map((alert, idx) => (
              <li
                key={idx}
                className={`${
                  alert.status === "resolved" ? "bg-green-100" : "bg-red-100"
                } border border-gray-300 p-4 rounded-md shadow-sm`}
              >
                {/* Alert or Resolution label */}
                <p className="font-semibold mb-1">
                  {alert.status === "resolved"
                    ? `✅ Resolved at ${new Date(alert.timestamp).toLocaleString()}`
                    : `⚠️ Alert at ${new Date(alert.timestamp).toLocaleString()}`}
                </p>

                {/* List of parameter issues */}
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
