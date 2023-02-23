// TODO: Refactor and animation
import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type TabData = { activeTabId: string | null };
type TabContext = {
  data: TabData;
  setData: React.Dispatch<SetStateAction<TabData>>;
};

const TabData = createContext<TabContext>({
  data: { activeTabId: null },
  setData: () => {
    return;
  },
});

export const TabsContainer = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<TabData>({
    activeTabId: "",
  });
  const tabContext = useMemo<TabContext>(() => ({ data, setData }), [data]);
  return <TabData.Provider value={tabContext}>{children}</TabData.Provider>;
};

export const TabListContainer = ({ children }: PropsWithChildren) => {
  const { setData } = useContext(TabData);

  const handleClick: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const target = e.target as HTMLLIElement;
    const li = target.closest("li");
    if (li) setData({ activeTabId: li.id });
  };

  return <ul onClick={handleClick}>{children}</ul>;
};

export const TabList = ({
  id,
  children,
}: PropsWithChildren<{ id: string }>) => {
  const {
    data: { activeTabId },
    setData,
  } = useContext(TabData);

  useEffect(() => {
    if (!activeTabId) {
      setData({ activeTabId: id });
    }
  }, []);

  return (
    <li className={activeTabId === id ? "active" : ""} id={id}>
      {children}
    </li>
  );
};

export const TabPanelContainer = ({ children }: PropsWithChildren) => {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
};

export const TabPanel = ({
  value,
  children,
}: PropsWithChildren<{ value: string }>) => {
  const {
    data: { activeTabId },
  } = useContext(TabData);

  if (activeTabId !== value) return null;

  return (
    <motion.div
      key={value}
      initial={{ opacity: 0.5, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}>
      {children}
    </motion.div>
  );
};
