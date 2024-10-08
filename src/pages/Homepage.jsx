import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <div className={styles.content}>
         <PageNav homePageNav={true} />
      <section>
        <h1>
          We give care to people.
          <br />
          Medical Instrument keeps track of the community needs.
        </h1>
        <h2>
          A web app that tracks.. lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </h2>

        <Link to="/app" className="cta">
          Start Ordering now
        </Link>
      </section>
      </div>
    </main>
  );
}
