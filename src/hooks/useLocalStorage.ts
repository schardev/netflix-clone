import { useCallback, useState } from "react";

const useLocalStorage = <T = any>(key: string, initialValue: T) => {
  const ls = window.localStorage;
  const [storageVal, setStorageVal] = useState(() => {
    const currentStorageValue = ls.getItem(key);
    if (!currentStorageValue) {
      ls.setItem(key, JSON.stringify(initialValue));
    }
    return JSON.parse(ls.getItem(key)!) as T; // TODO
  });

  const setValue = useCallback(
    (nextValue: T) => {
      let value = nextValue as string;
      if (!(typeof nextValue === "string")) value = JSON.stringify(nextValue);
      ls.setItem(key, value);
      setStorageVal(nextValue);
    },
    [key, initialValue]
  );

  return [storageVal, setValue] as const;
};

export default useLocalStorage;
