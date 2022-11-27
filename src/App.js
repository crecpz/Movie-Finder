import { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Movies from "./components/Movies";
import WatchCards from "./components/WatchCards";
import Home from "./page/Home";
import MovieDetail from "./page/MovieDetail";
import NotFound from "./page/NotFound";
import Search from "./page/Search";
import Watchlist from "./page/Watchlist";

// ! 記得處理 not-found
function App() {
  const [watchlist, setWatchlist] = useState(
    JSON.parse(window.localStorage.getItem("watchlist")) || []
  );

  return (
    <div className="App">
      <Router>
        <Header />
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
                />
              }></Route>
            {/* Movies */}
            <Route path="movies/:type" element={<Movies />}>
              <Route path=":genresId" element={<Movies />}></Route>
            </Route>
            {/* Watchlist */}
            <Route path="/watchlist" element={<Watchlist />}>
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
                <Search watchlist={watchlist} setWatchlist={setWatchlist} />
              }></Route>
            {/* Not Found */}
            <Route path="/*" element={<NotFound />}></Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
