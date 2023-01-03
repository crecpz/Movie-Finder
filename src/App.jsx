import { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Movies from "./pages/Movies/Movies";
import WatchCards from "./components/WatchCards/WatchCards";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import Watchlist from "./pages/Watchlist/Watchlist";
import Search from "./pages/Search/Search";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  // 存放 watchlist 資料
  const [watchlist, setWatchlist] = useState(
    JSON.parse(window.localStorage.getItem("watchlist")) || []
  );
  // 存放新增至 watchlist 後，未讀取的電影(數量提示)
  const [unreadList, setUnreadList] = useState(
    JSON.parse(window.localStorage.getItem("unreadList")) || []
  );

  useEffect(() => {
    // 以 window.innnerHeight 作為視窗的高度，css 相關設定於 _global-style.scss body 中
    function appHeight() {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    }
    appHeight();
  }, []);

  //* 更新 unreadList 至 localStorage
  useEffect(() => {
    window.localStorage.setItem("unreadList", JSON.stringify(unreadList));
  }, [unreadList]);

  //* 一旦 watchlist 改變，一併更新 localStorage
  useEffect(() => {
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <div className="App">
      <Router>
        {/* Header */}
        <Header watchlist={watchlist} unreadList={unreadList} />
        <main>
          <Routes>
            {/* Home */}
            <Route index path="/" element={<Home />}></Route>
            {/* MovieDetail */}
            <Route
              path="/movie/:id"
              element={
                <MovieDetail
                  watchlist={watchlist}
                  setWatchlist={setWatchlist}
                  setUnreadList={setUnreadList}
                />
              }></Route>
            {/* Movies */}
            <Route path="/movies">
              <Route
                path=":type"
                element={
                  <Movies
                    watchlist={watchlist}
                    setWatchlist={setWatchlist}
                    setUnreadList={setUnreadList}
                  />
                }>
                <Route
                  path=":genresId"
                  element={
                    <Movies
                      watchlist={watchlist}
                      setWatchlist={setWatchlist}
                      setUnreadList={setUnreadList}
                    />
                  }></Route>
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
                path=":currentWatchStatus"
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
            {/* NotFound */}
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
