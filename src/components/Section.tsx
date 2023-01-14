import { j } from "../utils";
import styles from "../styles/landing-page.module.scss";
import type { PropsWithChildren } from "react";

const Section = (props: PropsWithChildren<{ className?: string }>) => {
  return (
    <section className={styles["padded-section"]}>
      <div className={j(styles["section-content"], props.className || "")}>
        {props.children}
      </div>
    </section>
  );
};

export default Section;
