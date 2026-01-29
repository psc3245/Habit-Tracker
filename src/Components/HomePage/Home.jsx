import { useState, useEffect } from "react";

export default function Home({ user }) {
  return (
    <div>
      <h2> Welcome to Habit Tracker </h2>
      <p>This habit tracker app helps you build and maintain good habits.</p>
      <ul>
        <li>Create custom habits with optional tags.</li>
        <li>Track your daily progress.</li>
        <li>View your habit history and statistics.</li>
      </ul>
      <p>
        The user interface for this app (what you're seeing now!) was coded in
        React.js, and is hosted for free on Vercel. 
      </p>
      <p> The backend server for this website is a RESTful API built with Node.js and Express.</p>
      <p> Our team (me) is hard at working making frequent improvements. I hope you enjoy using this app!</p>
    </div>
  );
}
