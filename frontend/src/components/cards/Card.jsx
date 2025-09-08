// src/components/Card.jsx
import React from "react";

export const Card = ({ title, children, icon }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="text-blue-600 text-3xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <div className="text-gray-600">{children}</div>
      </div>
    </div>
  );
};