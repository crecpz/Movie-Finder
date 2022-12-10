import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../utils/components-styles";
import WatchCard from "./WatchCard";

const WatchCards = ({ watchlist, setWatchlist }) => {
  const { watchStatusTag = "unwatched" } = useParams();
  // 利用 watchlist 內的資料來 fetch，將 fetch 到的資料存放到 watchcards 中
  const [watchcards, setWatchcards] = useState([]);

  useEffect(() => {
    // 取得當前電影資料
    let subscribed = true;
    if (subscribed) {
      const getData = async () => {
        try {
          const results = await Promise.all(
            watchlist.map(({ id }) =>
              fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`
              )
            )
          );
          const finalData = await Promise.all(
            results.map((result) => result.json())
          );
          setWatchcards(
            finalData.map(({ id, poster_path, title }) => {
              const watchData = watchlist.find((i) => i.id === id);
              return {
                ...watchData,
                poster_path: poster_path,
                title: title,
              };
            })
          );
        } catch (err) {
          console.log(err);
        }
      };
      getData();
    }
    // clean func
    return () => {
      subscribed = false;
    };
  }, [watchlist]);

  //* 根據目前所在的位置(Unwatched or Watched)來決定 currentList 內容
  const currentList = watchcards.filter(
    ({ status }) => status === watchStatusTag
  );

  return (
    <div className="watchcards cards">
      {watchlist.some(({ status }) => status === watchStatusTag) ? (
        currentList.length ? (
          currentList.map(({ id, poster_path, title }) => {
            return (
              <WatchCard
                key={id}
                id={id}
                poster_path={poster_path}
                title={title}
                watchlist={watchlist}
                setWatchlist={setWatchlist}
              />
            );
          })
        ) : (
          <PulseLoader color="#fff" cssOverride={spinnerStyle} />
        )
      ) : (
        <p className="empty-msg">No movies in your list, add some!</p>
      )}
    </div>
  );
};

export default WatchCards;
