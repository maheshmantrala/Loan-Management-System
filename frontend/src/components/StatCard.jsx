import React from "react";

export default function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white p-6 rounded-lg shadow-md`}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
