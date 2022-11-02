import { useEffect } from "react";
import { useState } from "react";
import WatchCard from "../components/WatchCard";

const Watchlist = () => {
  // @ API: 輸入 ID 取得單一電影細節 "https://api.themoviedb.org/3/movie/{movie_id}?api_key=e86818f56e7d92f357708ecb03052800"
  // 記得替換 {movie_id}

  const [currentList, setCurrentList] = useState("");
  const [watchlist, setWatchlist] = useState({ unwatched: [1,2], watched: [] });

  useEffect(() => {}, []);

  const unwatchedElements = (
    <div className="watchlist__content watchlist__content--unwatched">
      {watchlist.unwatched.map((movie) => {
        return <WatchCard />;
      })}
    </div>
  );

  return (
    <div className="watchlist">
      <div className="container">
        <div className="watchlist__btns">
          <button className="btn watchlist__btn">Unwatched</button>
          <button className="btn watchlist__btn">Watched</button>
        </div>
        {unwatchedElements}
        <div className="watchlist__content watchlist__content--watched"></div>
      </div>
    </div>
  );
};

export default Watchlist;
