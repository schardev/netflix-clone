import styles from "../styles/landing-page.module.scss";

const Form = () => {
  return (
    <form action="#" className={styles["get-started-form"]}>
      <label htmlFor="email-field">
        Ready to watch? Enter your email to create or restart your membership.
      </label>
      <input
        id="email-field"
        type="email"
        autoComplete="email"
        placeholder="Email Address"
      />
      <button>Get Started</button>
    </form>
  );
};

export default Form;
