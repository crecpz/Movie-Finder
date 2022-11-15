import { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Movies from "./components/Movies";
import WatchCards from "./components/WatchCards";
import Home from "./page/Home";
import MovieDetail from "./page/MovieDetail";
import Search from "./page/Search";
import Watchlist from "./page/Watchlist";

// ! 記得處理 not-found
function App() {
  const API_URL =
    "https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc";

  const [watchlist, setWatchlist] = useState(
    JSON.parse(window.localStorage.getItem("watchlist")) || []
  );

  return (
    <div className="App">
      <Router>
        <Header />
        <main>
          <Routes>
            <Route index path="/" element={<Home />}></Route>
            <Route 
              path="movie/:id"
              element={
                <MovieDetail
                  watchlist={watchlist}
                  setWatchlist={setWatchlist}
                />
              }></Route>

            <Route path="movies/:type" element={<Movies />}>
              <Route path=":genresId" element={<Movies />}></Route>
            </Route>

            <Route path="/watchlist" element={<Watchlist />}>
              <Route
                path=":watchStatus"
                element={
                  <WatchCards
                    watchlist={watchlist}
                    setWatchlist={setWatchlist}
                  />
                }></Route>
            </Route>
            <Route
              path="/search"
              element={
                <Search watchlist={watchlist} setWatchlist={setWatchlist} />
              }></Route>
            <Route path="/*" element={<h1>not found</h1>}></Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
