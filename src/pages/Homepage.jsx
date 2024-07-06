import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          You give care to people.
          <br />
          Medical Instruments keeps track of your needs. Lorem ipsum dolor sit
          amet.
        </h1>
        <h2>
          A web app that tracks.. lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </h2>

        <Link to="/app" className="cta">
          Start Ordering now
        </Link>
      </section>
    </main>
  );
}
