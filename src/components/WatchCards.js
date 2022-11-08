import { useParams } from "react-router-dom";
import WatchCard from "./WatchCard";

const WatchCards = ({ watchlist, setWatchlist }) => {
  const { watchStatus } = useParams();

  const listContent =
    watchStatus === "unwatched"
      ? watchlist.filter((watchlistData) => !watchlistData.watched)
      : watchlist.filter((watchlistData) => watchlistData.watched);

  console.log(listContent);

  return (
    <div className="watchcards">
      {listContent.map((watchlistData) => {
        return (
          <WatchCard
          watchStatus={watchStatus}
            id={watchlistData.id}
            watched={watchlistData.watched}
            watchlist={watchlist}
            setWatchlist={setWatchlist}
          />
        );
      })}
    </div>
  );
};

export default WatchCards;
