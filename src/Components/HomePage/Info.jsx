import { useState, useEffect } from "react";

export default function Info() {
  return (
    <div>
      <h2>About The Creator</h2>
      <p>
        Hi, I'm Peter Collins, a senior at Iowa State University studying
        Computer Science with a minor in Cyber Security. I am builidng this app
        both as a personal project and because I wanted a habit tracking app and
        I never found one that had all the features I wanted. Since I know how
        to code, I figured I could just make my own!
      </p>
      <ul>
        <li>LinkedIn: https://linkedin.com/in/psc3245</li>
        <li>Github: https://github.com/psc3245</li>
        <li>Portfolio website: i don't got one yet...</li>
      </ul>
    </div>
  );
}
