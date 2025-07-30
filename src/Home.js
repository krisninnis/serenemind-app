import React from "react";
import "./App.scss";

function Home({ userData, setView }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Welcome, {userData.firstName} {userData.lastName}!
        </h1>
        <p>Start your journey to better mental health today.</p>
        <div className="button-group">
          <button onClick={() => setView("mood")}>Track Mood</button>
          <button onClick={() => setView("journal")}>Journal</button>
          <button onClick={() => setView("community")}>Community</button>
          <button onClick={() => setView("urgent")}>Urgent Help</button>
        </div>
      </header>
    </div>
  );
}

export default Home;
