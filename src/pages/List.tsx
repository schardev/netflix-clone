import { CheckCircle } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useMyListData } from "../contexts/MyListProvider";
import styles from "../styles/list-page.module.scss";

const List = () => {
  const { myList } = useMyListData();
  const navigate = useNavigate();

  return (
    <>
      {!myList.length ? (
        <div className={styles["no-list"]}>
          <CheckCircle />
          <p>
            Add movies & TV shows to your list so you can easily find them
            later.
          </p>
          <button onClick={() => navigate("/")}>
            Find something to to watch
          </button>
        </div>
      ) : (
        <>
          <main className={styles.main}>
            <h1>My List</h1>
            <div className={styles.slider}>
              {/* https://stackoverflow.com/a/59459000 */}
              {myList.map((item) => {
                return (
                  <Card
                    cardId={item.id}
                    mediaType={item.media_type}
                    posterImg={item.poster_path}
                  />
                );
              })}
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default List;
