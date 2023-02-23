import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import WithHeader from "./layout/WithHeader";
import WithModalListener from "./layout/WithModalListener";
import WithNavBar from "./layout/WithNavBar";
import ErrorPage from "./pages/ErrorPage";
import GenresPage from "./pages/GenresPage";
import Homepage from "./pages/Homepage";
import InfoPage from "./pages/InfoPage";
import LandingPage from "./pages/LandingPage";
import List from "./pages/List";
import MoviePage from "./pages/MoviePage";
import SearchPage from "./pages/SearchPage";
import TVPage from "./pages/TVPage";
import WithMyList from "./layout/WithMyList";
import { ModalProvider } from "./contexts/ModalContext";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route element={<WithMyList />}>
        <Route element={<WithModalListener />}>
          <Route element={<WithHeader />}>
            <Route index element={<LandingPage />} />
            <Route element={<WithNavBar />}>
              <Route path="browse" element={<Homepage />} />
              <Route path="movie" element={<MoviePage />} />
              <Route path="tv" element={<TVPage />} />
              <Route path="genres/:category/:id" element={<GenresPage />} />
              <Route path=":category/:id" element={<InfoPage />} />
              <Route path="list" element={<List />} />
              <Route path="search" element={<SearchPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  );
};

export default App;
