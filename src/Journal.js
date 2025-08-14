import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./styles/themes/App.scss";

const getToday = () => new Date().toISOString().split("T")[0];

const keywordsToTrack = [
  "lonely",
  "anxious",
  "sad",
  "happy",
  "stress",
  "tired",
];

function Journal() {
  const [entry, setEntry] = useState("");
  const [entryMood, setEntryMood] = useState("");
  const [filterMood, setFilterMood] = useState("");
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(getToday());
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("journalEntries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
    window.scrollTo(0, 0);
  }, []);

  const getKeywordCounts = () => {
    const entriesForDate = entries[selectedDate] || [];
    const counts = {};
    keywordsToTrack.forEach((keyword) => (counts[keyword] = 0));
    entriesForDate.forEach(({ text }) => {
      const textLower = text.toLowerCase();
      keywordsToTrack.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        const matches = textLower.match(regex);
        if (matches) counts[keyword] += matches.length;
      });
    });
    return counts;
  };

  const generateKeywordPrompts = (keywordCounts) => {
    const threshold = 2;
    return Object.entries(keywordCounts)
      .filter(([_, count]) => count >= threshold)
      .slice(0, 2)
      .map(
        ([keyword]) =>
          `You've mentioned feeling "${keyword}" a few times recently. Maybe take a moment to write about how this makes you feel, or ask Minda for support.`
      );
  };

  const displayDate = selectedDate === getToday() ? "Today" : selectedDate;

  const filteredEntries =
    filterMood && entries[selectedDate]
      ? entries[selectedDate].filter((e) => e.mood === filterMood)
      : entries[selectedDate] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      text: entry,
      mood: entryMood,
      time: new Date().toLocaleTimeString(),
    };

    const updated = {
      ...entries,
      [selectedDate]: [newEntry, ...(entries[selectedDate] || [])],
    };

    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
    setEntry("");
    setEntryMood("");
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Journal Entries – ${displayDate}`, 14, 20);

    const tableData = filteredEntries.map((e, i) => [
      i + 1,
      e.time,
      e.mood || "N/A",
      e.text,
    ]);

    autoTable(doc, {
      head: [["#", "Time", "Mood", "Entry"]],
      body: tableData,
      startY: 30,
      styles: {
        cellWidth: "wrap",
        overflow: "linebreak",
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 120 },
      },
    });

    doc.save(`Journal_${selectedDate}.pdf`);
  };

  const keywordCounts = getKeywordCounts();
  const keywordPrompts = generateKeywordPrompts(keywordCounts);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />
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
              rows={4}
              style={{
                padding: "10px",
                width: "100%",
                maxWidth: "400px",
                borderRadius: "8px",
              }}
            />
          </div>

          <div className="form-group">
            <label>Select your mood:</label>
            <select
              value={entryMood}
              onChange={(e) => setEntryMood(e.target.value)}
              required
              style={{
                padding: "8px",
                borderRadius: "8px",
                marginTop: "10px",
              }}
            >
              <option value="">Choose Mood</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="anxious">😟 Anxious</option>
              <option value="calm">😌 Calm</option>
              <option value="lonely">😔 Lonely</option>
              <option value="stress">😫 Stressed</option>
              <option value="tired">😴 Tired</option>
            </select>
          </div>

          <button type="submit" className="save-btn">
            Save
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <label>Filter by mood:</label>
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              marginLeft: "10px",
            }}
          >
            <option value="">All</option>
            <option value="happy">😊 Happy</option>
            <option value="sad">😢 Sad</option>
            <option value="anxious">😟 Anxious</option>
            <option value="calm">😌 Calm</option>
            <option value="lonely">😔 Lonely</option>
            <option value="stress">😫 Stressed</option>
            <option value="tired">😴 Tired</option>
          </select>
        </div>

        {keywordPrompts.length > 0 && (
          <div className="keyword-prompts" aria-live="polite" role="alert">
            {keywordPrompts.map((prompt, i) => (
              <div key={i} className="prompt-block">
                <p>{prompt}</p>
                <button
                  className="ask-minda-btn"
                  onClick={() => navigate("/chat")}
                >
                  Ask Minda
                </button>
              </div>
            ))}
          </div>
        )}

        <h2>Entries for {displayDate}</h2>
        <div className="page-list">
          {filteredEntries.length === 0 && <p>No entries for this filter.</p>}
          {filteredEntries.map((e, index) => (
            <div key={index} className={`page-box mood-${e.mood || "default"}`}>
              <p>
                <strong>{e.time}</strong> – {e.mood && <em>{e.mood}</em>}
              </p>
              <p>{e.text}</p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button onClick={exportToPDF}>Save Your Thoughts</button>
          <button className="link-button" onClick={() => navigate("/home")}>
            Back
          </button>
        </div>
      </header>
    </div>
  );
}

export default Journal;
