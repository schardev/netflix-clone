import { Link } from "react-router-dom";
import { useModalDispatcher } from "../contexts/ModalContext";
import styles from "../styles/list-modal.module.scss";
import Backdrop from "./Backdrop";
import Portal from "./Portal";

type ListModalProps = {
  entries: {
    title: string;
    list: { text: string; link?: string }[];
  }[];
};

const ListModal = ({ entries }: ListModalProps) => {
  const setModalData = useModalDispatcher();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;

    // Close modal after clicking on a link
    if (target.tagName === "SPAN" && target.parentElement?.tagName === "A") {
      setModalData({ visible: false });
    }
  };

  return (
    <Portal>
      <Backdrop>
        <div className={styles["modal-container"]}>
          {entries.map((entry) => {
            return (
              <div
                key={entry.title}
                className={styles["modal-section"]}
                onClick={handleClick}>
                <h2>{entry.title}</h2>
                <ul>
                  {entry.list.map((listEntry) => {
                    if (listEntry.link) {
                      return (
                        <li key={listEntry.text}>
                          <Link to={listEntry.link}>
                            <span>{listEntry.text}</span>
                          </Link>
                        </li>
                      );
                    } else {
                      return (
                        <li key={listEntry.text}>
                          <span>{listEntry.text}</span>;
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        {/* NOTE: button must be outside of the container inorder for it to 'stick'
        at the bottom due to `modal-conatiner` setting a filter property
        (@see https://stackoverflow.com/a/52937920) */}
        <button
          className={styles["modal-close-icon"]}
          onClick={() => setModalData({ visible: false })}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 15 15">
            <path
              fill="currentColor"
              d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5l3.469-3.468Z"
            />
          </svg>
        </button>
      </Backdrop>
    </Portal>
  );
};

export default ListModal;
