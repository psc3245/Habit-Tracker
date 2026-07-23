import "../../Style/HomeInfo.css";

export default function Info() {
  return (
    <div className="info-page">
      <h2 className="home-title">About The Creator</h2>
      <p>
        Hi, I'm Peter Collins, a senior at Iowa State University studying
        Computer Science with a minor in Cyber Security. I am building this
        app both as a personal project and because I wanted a habit tracking
        app and I never found one that had all the features I wanted. Since I
        know how to code, I figured I could just make my own!
      </p>
      <ul>
        <li>
          LinkedIn:{" "}
          <a
            href="https://linkedin.com/in/psc3245"
            target="_blank"
            rel="noreferrer"
          >
            linkedin.com/in/psc3245
          </a>
        </li>
        <li>
          Github:{" "}
          <a
            href="https://github.com/psc3245"
            target="_blank"
            rel="noreferrer"
          >
            github.com/psc3245
          </a>
        </li>
        <li>Portfolio website: i don't got one yet...</li>
      </ul>
    </div>
  );
}
