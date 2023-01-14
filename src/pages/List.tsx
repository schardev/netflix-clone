import { CheckCircledOutline } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import { useMyListData } from "../contexts/MyListProvider";
import styles from "../styles/list-page.module.scss";

const List = () => {
  const myList = useMyListData();
  const navigate = useNavigate();

  return (
    <>
      {!myList.length ? (
        <div className={styles["no-list"]}>
          <CheckCircledOutline />
          <p>
            Add movies & TV shows to your list so you can easily find them
            later.
          </p>
          <button onClick={() => navigate("/")}>
            Find something to to watch
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {/* https://stackoverflow.com/a/59459000 */}
          {myList.map((item) => {
            return (
              <div
                key={item.id}
                data-item-id={item.id}
                data-item-category={item.media_type}>
                <img src={item.poster_path} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default List;
