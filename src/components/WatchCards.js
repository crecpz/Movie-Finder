import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../utils/components-styles";
import WatchCard from "./WatchCard";

const WatchCards = ({ watchlist, setWatchlist }) => {
  const [watchCardLoaded, setWatchCardLoaded] = useState(true);

  // 根據目前網址的參數來取得目前為在 Unwatched 還是 Watched 頁面
  const { watchStatus } = useParams();

  const [listContent, setListContent] = useState(
    watchStatus === "unwatched" || watchStatus === undefined
      ? watchlist.filter((watchlistData) => !watchlistData.watched)
      : watchlist.filter((watchlistData) => watchlistData.watched)
  );

  // 存放各個 watchCard poster 載入狀態
  const [imgLoadStatus, setImgLoadStatus] = useState(
    listContent.map(({ id }) => ({ id, isLoaded: false }))
  );

  console.log("imgLoadStatus: ", imgLoadStatus);

  useEffect(() => {
    // console.log(imgLoadStatus);
  }, [imgLoadStatus]);

  // useEffect(() => {
  //   // setImgLoadStatus()
  // }, []);

  // console.log(imgLoadStatus);

  // let listContent =
  //   watchStatus === "unwatched" || watchStatus === undefined
  //     ? watchlist.filter((watchlistData) => !watchlistData.watched)
  //     : watchlist.filter((watchlistData) => watchlistData.watched);

  // listContent = listContent.map((watchlistData) => ({
  //   ...watchlistData,
  //   isLoaded: false,
  // }));

  // useEffect(() => {
  // setTimeout(() => {
  //   setWatchCardLoaded(true);
  // }, 1000);
  // }, []);

  return (
    <div className="cards">
      {listContent.length !== 0 ? (
        watchCardLoaded ? (
          listContent.map((watchlistData) => {
            return (
              <WatchCard
                key={watchlistData.id}
                watchStatus={watchStatus}
                id={watchlistData.id}
                watched={watchlistData.watched}
                watchlist={watchlist}
                setWatchlist={setWatchlist}
                // setImgLoadStatus={setImgLoadStatus}
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
