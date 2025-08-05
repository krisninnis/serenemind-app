import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Journal.scss";

function Journal({ setView }) {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState("All");

  const fetchEntries = async () => {
    try {
      const res = await axios.get("/api/journal");
      setEntries(res.data.reverse());
    } catch (err) {
      console.error("Error fetching entries:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry) return;
    try {
      await axios.post("/api/journal", {
        text: entry,
        date: new Date().toISOString(),
      });
      setEntry("");
      fetchEntries();
    } catch (err) {
      console.error("Error saving entry:", err);
    }
  };

  const moods = ["All", "Happy", "Sad", "Anxious", "Angry", "Neutral"];

  const filteredEntries =
    selectedMood === "All"
      ? entries
      : entries.filter((e) => e.mood === selectedMood);

  return (
    <div className="journal-page">
      <h2>My Journal</h2>
      <form onSubmit={handleSubmit} className="journal-form">
        <textarea
          placeholder="Write your thoughts..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <button type="submit">Save Entry</button>
      </form>

      <div className="mood-filter">
        <label>Filter by mood:</label>
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
        >
          {moods.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </div>

      <div className="entries-list">
        {filteredEntries.map((entry, idx) => (
          <div
            key={idx}
            className={`entry-card mood-${entry.mood?.toLowerCase()}`}
          >
            <div className="entry-date">
              {entry.date === new Date().toISOString().split("T")[0]
                ? "Today"
                : entry.date.split("T")[0]}
            </div>
            <div className="entry-text">{entry.text}</div>
            {entry.mood && <div className="entry-mood">Mood: {entry.mood}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Journal;
