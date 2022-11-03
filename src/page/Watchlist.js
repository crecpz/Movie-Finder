import { useEffect } from "react";
import { useState } from "react";
import WatchCard from "../components/WatchCard";

const Watchlist = ({ watchlist, setWatchlist }) => {

  const [currentList, setCurrentList] = useState("unwatched");
  const [currentListData, setCurrentListData] = useState(
    currentList === "unwatched"
      ? watchlist.filter((movie) => !movie.watched)
      : watchlist.filter((movie) => movie.watched)
  );

  useEffect(() => {
    setCurrentListData(
      currentList === "unwatched"
        ? watchlist.filter((movie) => !movie.watched)
        : watchlist.filter((movie) => movie.watched)
    );
  }, [currentList, watchlist]);

  useEffect(() => {
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // const currentListData =
  //   currentList === "unwatched"
  //     ? watchlist.filter((movie) => movie.unwatched)
  //     : watchlist.filter((movie) => !movie.unwatched);

  const watchCardsElements = currentListData.map((movie) => {
    return (
      <WatchCard
        {...movie}
        setWatchlist={setWatchlist}
        currentList={currentList}
        changeStatus={changeStatus}
      />
    );
  });

  function changeStatus(id) {
    // console.log(id)
    setWatchlist((prev) => {
      return prev.map((movie) => {
        if (movie.id === id) {
          return {
            ...movie,
            watched: !movie.watched,
          };
        } else {
          return movie;
        }
      });
    });
  }

  return (
    <div className="watchlist">
      <div className="container">
        <div className="watchlist__btns">
          <button
            className="btn watchlist__btn"
            onClick={() => setCurrentList("unwatched")}>
            Unwatched
          </button>
          <button
            className="btn watchlist__btn"
            onClick={() => setCurrentList("watched")}>
            Watched
          </button>
        </div>
        <div className="watchlist__content">{watchCardsElements}</div>
      </div>
    </div>
  );
};

export default Watchlist;
