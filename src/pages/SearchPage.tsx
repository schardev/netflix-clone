import { useRef } from "react";
import styles from "../styles/search-page.module.scss";
import Slider from "../components/Slider";
import { Search } from "iconoir-react";
import { Form, useSearchParams, useSubmit } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const sliderVariants = {
  initial: { y: 30 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 30, opacity: 0, transition: { duration: 0.1 } },
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const timeoutId = useRef<number>();
  const submit = useSubmit();
  const query = searchParams.get("q") || "";

  const handleChange: React.FormEventHandler<HTMLFormElement> = (e) => {
    if (timeoutId.current) clearTimeout(timeoutId.current);

    // grab the currentTarget as it'll be null by the time setTimeout executes
    const target = e.currentTarget;
    const formData = new FormData(target);
    const q = formData.get("q") as string;

    timeoutId.current = setTimeout(() => {
      if (q) {
        submit(target);
      }
    }, 400);
  };

  return (
    <motion.div
      className={styles.search}
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}>
      <Form className={styles["search-form"]} onChange={handleChange}>
        <Search />
        <input
          type="search"
          name="q"
          placeholder="Search for a show or movie."
          autoFocus
          defaultValue={query}
        />
      </Form>
      <AnimatePresence mode="wait">
        {query && (
          <motion.div
            key={query}
            variants={sliderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={styles["search-list"]}>
            <Slider
              title="Top Searches"
              endpoint="search/multi"
              params={{
                query,
              }}
              flow="column"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchPage;
