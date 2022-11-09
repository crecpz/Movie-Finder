import { useParams } from "react-router-dom";
import WatchCard from "./WatchCard";

const WatchCards = ({ watchlist, setWatchlist }) => {
  const { watchStatus } = useParams();

  const listContent =
    watchStatus === "unwatched"
      ? watchlist.filter((watchlistData) => !watchlistData.watched)
      : watchlist.filter((watchlistData) => watchlistData.watched);
  // ! No movies in your list, add some!
  return (
    <div className="watchcards">
      {console.log(listContent)}
      {listContent.length !== 0 ? (
        listContent.map((watchlistData) => {
          return (
            <WatchCard
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
