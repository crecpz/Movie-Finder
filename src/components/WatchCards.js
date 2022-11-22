import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../utils/components-styles";
import { getData } from "../utils/function";
import WatchCard from "./WatchCard";

const WatchCards = ({ watchlist, setWatchlist }) => {
  // 確認目前位於 Unwatched 還是 Watched
  const { watchStatusTag = "unwatched" } = useParams();

  // 存放 watchlist 電影資料
  const [watchcards, setWatchcards] = useState([]);

  const currentList =
    watchStatusTag === "unwatched"
      ? watchlist.filter(({ watched }) => !watched)
      : watchlist.filter(({ watched }) => watched);

  useEffect(() => {
    let subscribed = true;
    // 取得當前電影資料
    if (subscribed) {
      const getData = async () => {
        try {
          const results = await Promise.all(
            currentList.map(({ id }) =>
              fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`
              )
            )
          );

          const finalData = await Promise.all(
            results.map((result) => result.json())
          );

          setWatchcards(
            finalData.map(({ id, poster_path, title }) => ({
              id: id,
              poster_path: poster_path,
              title: title,
            }))
          );
        } catch (err) {
          console.log(err);
        }
      };

      getData();
    }

    return () => {
      subscribed = false;
    };
  }, [watchlist, watchStatusTag]);

  return (
    <div className="cards">
      {watchcards.map(({ id, poster_path, title }) => {
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
      })}

      {/* <p className="empty-msg">No movies in your list, add some!</p> */}
      {/*  <PulseLoader color="#fff" cssOverride={spinnerStyle} /> */}
    </div>
  );

  // ! 舊的
  // const WatchCards = ({ watchlist, setWatchlist }) => {
  //   // 目前的電影的 poster 是否全部已經載入完畢
  //   const [watchCardLoaded, setWatchCardLoaded] = useState(true);
  //   //  目前的電影的 poster 載入狀態
  //   const [imgStatus, setImgStatus] = useState([
  //   ]);

  //   // 根據目前網址的參數來取得目前為在 Unwatched 還是 Watched 頁面
  //   const { watchStatus } = useParams();

  //   const [listContent, setListContent] = useState(
  //     watchStatus === "unwatched" || watchStatus === undefined
  //       ? watchlist.filter((watchlistData) => !watchlistData.watched)
  //       : watchlist.filter((watchlistData) => watchlistData.watched)
  //   );

  //   // const []

  //   // let listContent =
  //   //   watchStatus === "unwatched" || watchStatus === undefined
  //   //     ? watchlist.filter((watchlistData) => !watchlistData.watched)
  //   //     : watchlist.filter((watchlistData) => watchlistData.watched);

  //   // listContent = listContent.map((watchlistData) => ({
  //   //   ...watchlistData,
  //   //   isLoaded: false,
  //   // }));

  //   // useEffect(() => {
  //   // setTimeout(() => {
  //   //   setWatchCardLoaded(true);
  //   // }, 1000);
  //   // }, []);

  //   return (
  //     <div className="cards">
  //       {listContent.length !== 0 ? (
  //         watchCardLoaded ? (
  //           listContent.map((watchlistData) => {
  //             return (
  //               <WatchCard
  //                 key={watchlistData.id}
  //                 watchStatus={watchStatus}
  //                 id={watchlistData.id}
  //                 watched={watchlistData.watched}
  //                 watchlist={watchlist}
  //                 setWatchlist={setWatchlist}
  //               />
  //             );
  //           })
  //         ) : (
  //           <PulseLoader color="#fff" cssOverride={spinnerStyle} />
  //         )
  //       ) : (
  //         <p className="empty-msg">No movies in your list, add some!</p>
  //       )}
  //     </div>
  //   );

  // return (
  //   <div className="cards">
  //     {listContent.length !== 0 ? (
  //       watchCardLoaded ? (
  //         listContent.map((watchlistData) => {
  //           return (
  //             <WatchCard
  //               key={watchlistData.id}
  //               watchStatus={watchStatus}
  //               id={watchlistData.id}
  //               watched={watchlistData.watched}
  //               watchlist={watchlist}
  //               setWatchlist={setWatchlist}
  //             />
  //           );
  //         })
  //       ) : (
  //         <PulseLoader color="#fff" cssOverride={spinnerStyle} />
  //       )
  //     ) : (
  //       <p className="empty-msg">No movies in your list, add some!</p>
  //     )}
  //   </div>
  // );
};

export default WatchCards;
