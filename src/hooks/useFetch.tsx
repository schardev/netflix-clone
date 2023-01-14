// simple useFetch hook inspired from this amazing blog post
// https://www.robinwieruch.de/react-hooks-fetch-data/
import { useDebugValue, useEffect, useReducer } from "react";

type Fetcher<Data> = (fetchOptions: RequestInit) => Promise<Data>;
type FetchReturn<Data, Error> = {
  data: Data;
  error: Error;
  isLoading: boolean;
};

type ReducerState = { data: any; error: any; isLoading: boolean };
type ReducerDispatchAction = {
  type: "FETCH_INIT" | "FETCH_SUCCESS" | "FETCH_ERROR";
  payload?: any;
};

const reducer = (state: ReducerState, action: ReducerDispatchAction) => {
  switch (action.type) {
    case "FETCH_INIT": {
      return { ...state, error: null, isLoading: true };
    }
    case "FETCH_SUCCESS": {
      return { error: null, isLoading: false, data: action.payload };
    }
    case "FETCH_ERROR": {
      return { ...state, error: action.payload, isLoading: false };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Global cache
// TODO: Use component level local cache, once we figured out how to perist a data
// across route endpoints since react-router mounts/unmounts components upon navigation
// The problem with current implementation is that the key has to be globably unique
// for the fetcher to identify it properly which is suboptimal
const cache = new Map();

const useFetch = <Data = any, Error = any>(
  key: string | number,
  fetcher: Fetcher<Data>
): FetchReturn<Data, Error> => {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
    isLoading: false,
  });
  useDebugValue(state);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      if (cache.get(key)) {
        // console.log("exiting fetch and using cache");
        dispatch({ type: "FETCH_SUCCESS", payload: cache.get(key) });
      } else {
        // console.log("fetching ...");
        try {
          dispatch({ type: "FETCH_INIT" });
          const res = await fetcher({ signal: controller.signal });
          cache.set(key, res);
          dispatch({ type: "FETCH_SUCCESS", payload: res });
        } catch (error) {
          // NOTE: Not handling DOMException error throw by aborting the current request
          if (error instanceof Response) {
            dispatch({ type: "FETCH_ERROR", payload: error });
          }
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [key]);

  return state;
};

export default useFetch;
