import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./page/Home";
import Header from "./components/Header";
import Movies from "./components/Movies";
import WatchCards from "./components/WatchCards";
import MovieDetail from "./page/MovieDetail";
import Watchlist from "./page/Watchlist";
import Search from "./page/Search";
import NotFound from "./page/NotFound";
import { useEffect } from "react";

function App() {
  const [watchlist, setWatchlist] = useState(
    JSON.parse(window.localStorage.getItem("watchlist")) || []
  );

  const [unreadList, setUnreadList] = useState(
    JSON.parse(window.localStorage.getItem("unreadList")) || []
  );

  useEffect(() => {
    window.localStorage.setItem("unreadList", JSON.stringify(unreadList));
  }, [unreadList]);

  return (
    <div className="App">
      <Router>
        <Header watchlist={watchlist} unreadList={unreadList} />
        <main>
          <Routes>
            {/* Home */}
            <Route index path="/" element={<Home />}></Route>

            {/* MovieDetail */}
            <Route
              path="movie/:id"
              element={
                <MovieDetail
                  watchlist={watchlist}
                  setWatchlist={setWatchlist}
                  setUnreadList={setUnreadList}
                />
              }></Route>

            {/* Movies */}
            <Route path="movies/">
              <Route path="new" element={<Movies type="new" />}></Route>
              <Route path="popular" element={<Movies type="popular" />}></Route>
              <Route path="genres" element={<Movies type="genres" />}>
                <Route
                  path=":genresId"
                  element={<Movies type="genres" />}></Route>
              </Route>
            </Route>

            {/* Watchlist */}
            <Route
              path="/watchlist"
              element={<Watchlist setUnreadList={setUnreadList} />}>
              <Route
                index
                element={
                  <WatchCards
                    watchlist={watchlist}
                    setWatchlist={setWatchlist}
                  />
                }></Route>
              <Route
                path=":watchStatusTag"
                element={
                  <WatchCards
                    watchlist={watchlist}
                    setWatchlist={setWatchlist}
                  />
                }></Route>
            </Route>

            {/* 搜尋頁面 */}
            <Route
              path="/search"
              element={
                <Search
                  watchlist={watchlist}
                  setWatchlist={setWatchlist}
                  setUnreadList={setUnreadList}
                />
              }></Route>

            <Route path="/notfound" element={<NotFound />}></Route>
            <Route
              path="/*"
              element={<Navigate to="/notfound" replace />}></Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
