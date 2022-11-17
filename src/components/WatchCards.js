import { useParams } from "react-router-dom";
import WatchCard from "./WatchCard";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../utils/components-styles";
import { useState } from "react";

const WatchCards = ({ watchlist, setWatchlist }) => {
  // 根據目前網址的參數來取得目前為在 Unwatched 還是 Watched 頁面
  const { watchStatus } = useParams();
  let listContent =
    watchStatus === "unwatched" || watchStatus === undefined
      ? watchlist.filter((watchlistData) => !watchlistData.watched)
      : watchlist.filter((watchlistData) => watchlistData.watched);
  listContent = listContent.map((watchlistData) => ({
    ...watchlistData,
    isLoaded: false,
  }));


  return (
    <div className="watchcards">
      {listContent.length !== 0 ? (
        listContent.map((watchlistData) => {
          return (
            <WatchCard
              key={watchlistData.id}
              watchStatus={watchStatus}
              id={watchlistData.id}
              watched={watchlistData.watched}
              watchlist={watchlist}
              setWatchlist={setWatchlist}
            />
          );
        })
      ) : (
        <p className="empty-msg">No movies in your list, add some!</p>
      )}
    </div>
  );
};

export default WatchCards;
