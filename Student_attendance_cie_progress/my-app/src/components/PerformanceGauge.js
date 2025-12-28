// src/components/PerformanceGauge.js
import React, { useEffect, useState } from "react";
import "./gauge.css";

export default function PerformanceGauge({ value }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = end / (duration / 16);

    const animation = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(animation);
      }
      setAnimatedValue(Math.floor(start));
    }, 16);

    return () => clearInterval(animation);
  }, [value]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className="circular-gauge-container">
      <div className="gauge-wrapper">
        <svg className="gauge-svg" width="120" height="120" viewBox="0 0 120 120">
          <circle
            className="gauge-background"
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="12"
            fill="none"
          />
          <circle
            className="gauge-progress"
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="gauge-center-text">
          <span className="gauge-percentage">{animatedValue}%</span>
        </div>
      </div>
      <div className="gauge-label">PRO LEARNER</div>
    </div>
  );
}