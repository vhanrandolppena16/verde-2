// About.jsx

import React, {useEffect} from 'react';

const teamMembers = [
  {
    name: "Jairkim D. Dielgo",
    role: "Data Science",
    image: "/team/jairkim.jpg",
  },
  {
    name: "Charles Lester Magdalang",
    role: "Intelligent System",
    image: "/team/charles.jpg",
  },
  {
    name: "Vhan Randjee S. Peña",
    role: "Data Science",
    image: "/team/vhan.jpg",
  },
  {
    name: "Ralph Andre M. Dicera",
    role: "System Administration",
    image: "/team/ralph.jpg",
  },
];

const AboutPage = () => {

  useEffect(() => {
    document.title = "About | Verde";
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl shadow-xl text-center">
      <h2 className="text-2xl font-bold mb-6">TEAM 48</h2>

      {/* 🧑‍🤝‍🧑 Team Members Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mb-6">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-black mb-2"
            />
            <p className="font-semibold text-sm">{member.name}</p>
            <p className="text-xs text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>

      {/* 🎯 Objective */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2 border-t pt-4 border-green-600 inline-block">Our Objective</h3>
        <p className="text-sm text-gray-700 leading-relaxed px-4">
          Team 48 is composed of 4th Year college students, currently pursuing Bachelor
          of Science in Computer Engineering at Technological Institute of the Philippines.
          Our purpose is to implement a Machine Learning-based Model Predictive Control System
          for Automated Hydroponic Crop Cultivation, which lessens manual intervention for farmers
          or hobbyists who have been planting such crops with a hydroponic setup. This system is to
          maximize plant growth by predicting the most efficient environmental parameters such as
          temperature, humidity, pH, and total dissolved solids according to a crop’s growth stage.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
