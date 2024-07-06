// Uses the same styles as Sales

import PageNav from "../components/PageNav";
import styles from "./Sales.module.css";

export default function Shipping() {
  return (
    <main className={styles.sale}>
      <PageNav />
      <section>
        <div>
          <h2>
            Fast shipping.
            <br />
            Efficient tracking.
          </h2>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae vel
            labore mollitia iusto. Recusandae quos provident, laboriosam fugit
            voluptatem iste.
          </p>
        </div>
        <img src="img-2.jpg" alt="overview of a large city with skyscrapers" />
      </section>
    </main>
  );
}
