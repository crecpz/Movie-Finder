import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../utils/components-styles";
import WatchCard from "./WatchCard";

const WatchCards = ({ watchlist, setWatchlist }) => {
  const { watchStatusTag = "unwatched" } = useParams();
  // @ 從 watchlist 中 fetch 電影資料，存放到 watchcards state 中
  const [watchcards, setWatchcards] = useState([]);

  useEffect(() => {
    // 取得當前電影資料
    let subscribed = true;
    if (subscribed) {
      // ! old ---
      // const getData = async (id) => {
      // ! old ---

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

          // ! old ---
          // const result = await fetch(
          //   `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`
          //   );
          //   const data = await result.json();
          //   // 取得當前 id 電影在 watchlist 中的資料
          // const watchData = watchlist.find((i) => i.id === id);
          // // watchlist 資料、id、poster_path、title 一併放入 watchcards
          // setWatchcards((prev) => [
          //   ...prev,
          //   { ...watchData, poster_path: data.poster_path, title: data.title },
          // ]);
          // ! old ---
        } catch (err) {
          console.log(err);
        }
      };

      // ! old ---
      // 遍歷 watchlist 中的每一個電影，以 id 作為參數，進行 fetch
      // watchlist.forEach(({ id }) => getData(id));
      // ! old ---
      getData();
    }
    // clean func
    return () => {
      subscribed = false;
    };
  }, [watchlist]);

  // 根據目前所在的標籤(Unwatched or Watched)來決定 currentList 內容
  // const currentList =
  //   watchStatusTag === "unwatched"
  //     ? watchcards.filter(({ watched }) => !watched)
  //     : watchcards.filter(({ watched }) => watched);
  const currentList = watchcards.filter(
    ({ status }) => status === watchStatusTag
  );

  return (
    <div className="watchlist__cards cards">
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
