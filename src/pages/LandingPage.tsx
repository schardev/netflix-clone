import Accordion from "../components/Accordion";
import Form from "../components/Form";
import Section from "../components/Section";
import { j } from "../utils";
import styles from "../styles/landing-page.module.scss";

const LandingPage = () => {
  return (
    <>
      <div className={j(styles["image-wrapper"], styles["image-section"])}>
        <Section className={styles["intro-section"]}>
          <h1>Unlimited movies, TV shows and more.</h1>
          <p>Watch anywhere. Cancel anytime.</p>
          <Form />
        </Section>
      </div>
      <Section>
        <div>
          <h2>Enjoy on your TV.</h2>
          <p>
            Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray
            players and more.
          </p>
        </div>
        <div className={styles["tv-demo-wrapper"]}>
          <img src="/tv.png" alt="" />
          <video
            className={styles["tv-demo-video"]}
            autoPlay
            loop
            playsInline
            muted
            src="/tv-video.m4v"></video>
        </div>
      </Section>
      <Section>
        <div>
          <h2>Download your shows to watch offline.</h2>
          <p>Save your favourites easily and always have something to watch.</p>
        </div>
        <div className={styles["mobile-demo-wrapper"]}>
          <img src="/mobile-demo.jpg" alt="" />
          <div className={styles["mobile-download-demo"]}>
            <img src="/boxshot.png" alt="" />
            <div className={styles["mobile-download-demo-title"]}>
              <p>Stranger Things</p>
              <p>Downloading...</p>
            </div>
            <img src="/download-icon.gif" alt="" />
          </div>
        </div>
      </Section>
      <Section>
        <div>
          <h2>Watch everywhere.</h2>
          <p>
            Stream unlimited movies and TV shows on your phone, tablet, laptop,
            and TV.
          </p>
        </div>
        <div className={styles["watch-demo-wrapper"]}>
          <img src="/watch-demo.png" alt="" />
          <video
            className={styles["watch-demo-video"]}
            autoPlay
            loop
            playsInline
            muted
            src="/watch-demo-vid.m4v"></video>
        </div>
      </Section>
      <Section>
        <div>
          <h2>Create profiles for children.</h2>
          <p>
            Send children on adventures with their favourite characters in a
            space made just for them—free with your membership.
          </p>
        </div>
        <img src="/annoying-kids.png" alt="" />
      </Section>
      <Section>
        <h2>Frequently Asked Questions</h2>
        <Accordion />
        <Form />
      </Section>
    </>
  );
};

export default LandingPage;
