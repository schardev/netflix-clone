import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
} from "react";
import type { MyList, MediaType } from "../types/app";

export const MyListData = createContext<{
  myList: MyList[];
  isInList: (id: number, mediaType: MediaType) => boolean;
} | null>(null);

export const MyListDispatch =
  createContext<React.Dispatch<ListDispatchAction> | null>(null);

export const useMyListData = () => {
  const myList = useContext(MyListData);
  if (!myList)
    throw new Error("useMyListData must be used within MyListData Provider");
  return myList;
};

export const useMyListDispatcher = () => {
  const dispatchToList = useContext(MyListDispatch);
  if (!dispatchToList)
    throw new Error(
      "useMyListDispatcher must be used within MyListDispatch Provider"
    );
  return dispatchToList;
};

type ListDispatchAction =
  | { type: "add"; payload: MyList }
  | { type: "remove"; payload: Pick<MyList, "id" | "media_type"> };

const reducer = (state: MyList[], action: ListDispatchAction) => {
  const ls = window.localStorage;
  let newState: MyList[] = [];

  switch (action.type) {
    case "add": {
      const isInList = state.some((item) => {
        if (
          item.id === action.payload.id &&
          item.media_type === action.payload.media_type
        ) {
          return true;
        }
        return false;
      });

      // if it's already in the list to fallthrough and remove it (basically
      // acting as a toggle), else we set `newState` with the added item
      if (!isInList) {
        const { id, media_type, poster_path } = action.payload;
        newState = [
          ...state,
          {
            id,
            media_type,
            poster_path,
          },
        ];
        break;
      }
    }
    // eslint-disable-next-line no-fallthrough
    case "remove": {
      newState = state.filter((item) => {
        if (
          item.id === action.payload.id &&
          item.media_type === action.payload.media_type
        ) {
          return false;
        }
        return true;
      });
      break;
    }
    default:
      console.error("Unhandled action type: ", action);
  }

  // keep the local storage copy up-to-date with the current state
  ls.setItem("my-list", JSON.stringify(newState));
  return newState;
};

const MyListProvider = ({ children }: PropsWithChildren) => {
  const storageList = window.localStorage.getItem("my-list");
  const parsedList = storageList ? JSON.parse(storageList) : [];
  const [myList, dispatch] = useReducer(reducer, parsedList);

  // Utility function to check if an item is already present in the list
  const isInList = useCallback(
    (id: number, mediaType: MediaType) => {
      return myList.some((item) => {
        if (item.id === id! && item.media_type === mediaType) {
          return true;
        }
        return false;
      });
    },
    [myList]
  );

  return (
    <MyListData.Provider value={{ myList, isInList }}>
      <MyListDispatch.Provider value={dispatch}>
        {children}
      </MyListDispatch.Provider>
    </MyListData.Provider>
  );
};

export default MyListProvider;
