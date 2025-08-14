import React, { useState, useEffect } from "react";
import axios from "axios";

const BREATHING_LEVELS = [
  { value: "slow_sloth", label: "Slow Sloth (1 min)" },
  { value: "calm_koala", label: "Calm Koala (2 min)" },
  { value: "zen_zebra", label: "Zen Zebra (3 min)" },
];

export default function SessionPreferences() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/user-preferences", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedLevel(res.data.breathingSessionLevel || "");
      } catch (err) {
        setError("Failed to load preferences.");
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    setSelectedLevel(e.target.value);
    setSuccessMsg(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/user-preferences",
        { breathingSessionLevel: selectedLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("Preferences saved successfully!");
    } catch (err) {
      setError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading preferences...</p>;

  return (
    <div className="preferences-container">
      <h2>Breathing Session Preferences</h2>
      <form onSubmit={handleSubmit}>
        {BREATHING_LEVELS.map(({ value, label }) => (
          <div key={value} className="radio-option">
            <input
              type="radio"
              id={value}
              name="breathingSessionLevel"
              value={value}
              checked={selectedLevel === value}
              onChange={handleChange}
            />
            <label htmlFor={value}>{label}</label>
          </div>
        ))}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      {successMsg && <p className="success-msg">{successMsg}</p>}
    </div>
  );
}
