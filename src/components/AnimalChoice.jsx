import React from "react";
import { useNavigate } from "react-router-dom";
import "./AnimalChoice.scss";

const animals = [
  {
    key: "slowSloth",
    name: "Slow Sloth",
    description: "Beginner - 1 minute slow and steady breathing",
    color: "#3a6565",
  },
  {
    key: "calmKoala",
    name: "Calm Koala",
    description: "Intermediate - 2 minute calming breath",
    color: "#51667a",
  },
  {
    key: "zenZebra",
    name: "Zen Zebra",
    description: "Pro - 3 minute zen breathing mastery",
    color: "#7a5167",
  },
];

function AnimalChoice() {
  const navigate = useNavigate();

  const handleSelect = (key) => {
    localStorage.setItem("breathingAnimal", key);
    navigate("/home");
  };

  return (
    <div className="animal-choice App">
      <h1>Choose your Breathing Buddy</h1>
      <p>Pick an animal to guide your mindfulness journey.</p>
      <div className="animal-list">
        {animals.map(({ key, name, description, color }) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            style={{ backgroundColor: color }}
            className="animal-button"
          >
            <h2>{name}</h2>
            <p>{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AnimalChoice;
