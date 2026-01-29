import {useState, useEffect} from "react"; 

export default function Info() {
  return (
    <div>
      <h2>About This App</h2>
      <p>This habit tracker app helps you build and maintain good habits.</p>
      <ul>
        <li>Create custom habits with optional tags.</li>
        <li>Track your daily progress.</li>
        <li>View your habit history and statistics.</li>
      </ul>
    </div>
  );
}