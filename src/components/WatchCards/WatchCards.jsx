import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WatchCard from "./WatchCard";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../../utils/components-styles";

const WatchCards = ({ watchlist, setWatchlist }) => {
  // 網址參數
  const { currentWatchStatus = "unwatched" } = useParams();
  // 利用 watchlist 內的資料來 fetch，將 fetch 到的資料存放到 watchcards 中
  const [watchcards, setWatchcards] = useState([]);

  useEffect(() => {
    // 取得當前電影資料
    let subscribed = true;
    if (subscribed) {
      const getData = async () => {
        try {
          // 從 watchlist 內每一項 item 中的 id 屬性獲取 watchlist 電影的資料，集成 Promise Array
          const results = await Promise.all(
            watchlist.map(({ id }) =>
              fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`
              )
            )
          );
          // Promise Array 轉為 JSON 格式
          const finalData = await Promise.all(
            results.map((result) => result.json())
          );
          // 將結果存至 watchcards state 中
          setWatchcards(
            // 從 finalData 提取需要的資料: id, poster_path, title
            finalData.map(({ id, poster_path, title }) => {
              // 在 watchlist 中尋找跟當前 map 到的 id 相符的 watchlistItem
              const watchData = watchlist.find(
                (watchlistItem) => watchlistItem.id === id
              );
              // 返回一個物件，內容包含「原有的 watchlist 資料(id, status)」 + 「上面獲取到的 poster_path, title 屬性」
              return {
                ...watchData,
                poster_path,
                title,
              };
            })
          );
        } catch (err) {
          console.log(err);
        }
      };
      getData();
    }
    // cleanup function
    return () => (subscribed = false);
  }, [watchlist]);

  //* 根據目前所在的位置(Unwatched or Watched)來決定 currentList 內容
  const currentList = watchcards.filter(
    ({ status }) => status === currentWatchStatus
  );

  return (
    <div className="watchcards cards">
      {watchlist.some(({ status }) => status === currentWatchStatus) ? (
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
