import { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Movies from "./components/Movies";
import MovieList from "./components/Movies";
import Genres from "./page/Genres";
import Home from "./page/Home";
import MovieDetail from "./page/MovieDetail";
import Search from "./page/Search";
import Watchlist from "./page/Watchlist";

// ! 記得處理 not-found
function App() {
  const API_URL =
    "https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc";

  useEffect(() => {
    console.log(JSON.parse(window.localStorage.getItem("watchlist")));
    setWatchlist(JSON.parse(window.localStorage.getItem("watchlist")) || []);
  }, []);

  // @ watchlist 需要傳入 search、moviedetail 等有 add to watchlist 的地方

  // ! 如果使用 unwatched 作為按鈕上面顯示是否加入 watchlist 的唯一指標，會產生一個問題
  // ! 那就是如果使用者將一個 unwatched 的電影加入到 watched 後，unwatched 內就不在有
  // ! 該電影，按鈕會標記成不在 watchlist 上，但是該電影明明就在 watchlist 上，他只是在
  // ! watched 內而已。
  // @ 所以我想到的方式是不要使用兩種指標，而是使用 array 內包著電影物件
  /**
   * const [watchlist, setWatchlist] = useState([])
   *
   * 像這樣:
   * [{},{},{}]
   *
   * 單一的長這樣:
   * [{id: 2654, watched: false}]
   *
   * 後續再使用過濾的方式過濾出是否觀看即可
   */
  const [watchlist, setWatchlist] = useState([]);

  return (
    <div className="App">
      <Router>
        <Header />
        <main>
          <Routes>
            <Route index element={<Home />}></Route>

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

            {/* <Route path="movies/:type" element={<Genres />}>
            <Route path=":genresId" element={<Movies />}></Route>
          </Route> */}

            <Route
              path="/watchlist"
              element={
                <Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />
              }></Route>

            <Route path="/search" element={<Search />}></Route>

            <Route path="/*" element={<h1>not found</h1>}></Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
