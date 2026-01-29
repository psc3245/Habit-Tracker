import {useState, useEffect} from "react";

export default function Home({ user }) {
  return (
    
    <div>
      <h1>{user ? `Welcome, ${user.username}!` : "Welcome!"}</h1>
      <p>This is your habit tracker home page.</p>
    </div>
    
  );
}