// src/helpers/getBreathingLevel.js
export function getBreathingLevel() {
  const storedLevel = localStorage.getItem("breathingLevel");
  return storedLevel || "sloth"; // default to sloth if not set
}
