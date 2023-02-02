import styles from "../styles/landing-page.module.scss";
import { faq } from "../static/faq.json";

const Accordion = () => {
  return (
    <ul className={styles.accordion}>
      {faq.map((que, qIdx) => {
        return (
          // key is only passed to stop react from yelling at me, even though it
          // is the default behavior
          <li key={qIdx}>
            <details>
              <summary>{que.question}</summary>
              {que.answer.map((ans, aIdx) => (
                <p key={aIdx}>{ans}</p>
              ))}
            </details>
          </li>
        );
      })}
    </ul>
  );
};

export default Accordion;
