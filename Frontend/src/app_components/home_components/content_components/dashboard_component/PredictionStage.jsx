// FinalContentArea.jsx
import React from "react";
import GrowthStage from "../../../../assets/images/lettuce-growing-timeline.png";


const PredictionStage = () => {
  return (
    <div
      className="
        relative flex items-center justify-center
        bg-green-50 rounded-2xl shadow-md h-[50%] min-h-[240px]
      "
      style={{
        backgroundImage: `url(${GrowthStage})`,
        backgroundSize: "95% 90%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <h2 className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-100 py-1 rounded-md text-sm font-2xl shadow">
        Prediction Results
      </h2>
    </div>
  );
};

export default PredictionStage;
