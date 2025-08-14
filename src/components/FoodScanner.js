import React from "react";
import "./FoodScanner.scss";

function FoodScanner({ userData }) {
  return (
    <div className="food-scanner-container">
      <h1>🍎 Koala Food Scanner</h1>
      <p>
        Scan barcodes or search for food items to check their nutritional info
        and health scores.
      </p>
      <button disabled>Start Scanning (Coming Soon)</button>
    </div>
  );
}

export default FoodScanner;
