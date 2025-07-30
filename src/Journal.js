import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";

function Journal() {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(getToday());
  const navigate = useNavigate();

  function getToday() {
    return new Date().toISOString().split("T")[0]; // e.g. "2025-07-30"
  }

  useEffect(() => {
    const saved = localStorage.getItem("journalEntries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      text: entry,
      time: new Date().toLocaleTimeString(),
    };

    const updated = {
      ...entries,
      [selectedDate]: [newEntry, ...(entries[selectedDate] || [])],
    };

    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
    setEntry("");
    alert("Journal entry saved!");
  };

  const handleDelete = (index) => {
    const updatedDateEntries = (entries[selectedDate] || []).filter(
      (_, i) => i !== index
    );
    const updated = {
      ...entries,
      [selectedDate]: updatedDateEntries,
    };

    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
  };

  const displayDate = selectedDate === getToday() ? "Today" : selectedDate;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Journal</h1>

        <label>
          Select a date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Write your thoughts for {displayDate}:</label>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              required
              placeholder="Express yourself..."
            />
          </div>
          <button type="submit">Save</button>
        </form>

        <h2>Entries for {displayDate}</h2>
        <div className="journal-entries">
          {(!entries[selectedDate] || entries[selectedDate].length === 0) && (
            <p>No entries for this date.</p>
          )}
          {entries[selectedDate]?.map((e, index) => (
            <div key={index} className="entry">
              <p>
                <strong>{e.time}</strong>
              </p>
              <p>{e.text}</p>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/home")} className="back-button">
          Back
        </button>
      </header>
    </div>
  );
}

export default Journal;
