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

  console.log(currentList);

  return (
    <div className="cards">
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

      {/* <p className="empty-msg">No movies in your list, add some!</p> */}
      {/*  <PulseLoader color="#fff" cssOverride={spinnerStyle} /> */}
    </div>
  );
};

// ! 舊的1
// const WatchCards = ({ watchlist, setWatchlist }) => {
//   // @ 根據目前 useParams() 中的 watchStatusTag 值來撈出 watchlist 中相對應的資料
//   const { watchStatusTag = "unwatched" } = useParams();
//   const currentList =
//     watchStatusTag === "unwatched"
//       ? watchlist.filter(({ watched }) => !watched)
//       : watchlist.filter(({ watched }) => watched);

//   // @ 從 currentList 中 fetch 電影資料，存放到 watchcards state 中
//   const [watchcards, setWatchcards] = useState([]);

//   useEffect(() => {
//     let subscribed = true;
//     // 取得當前電影資料
//     if (subscribed) {
//       const getData = async () => {
//         try {
// const results = await Promise.all(
//   currentList.map(({ id }) =>
//     fetch(
//       `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`
//     )
//   )
// );
// const finalData = await Promise.all(
//   results.map((result) => result.json())
// );
// setWatchcards(
//   finalData.map(({ id, poster_path, title }) => ({
//     id: id,
//     poster_path: poster_path,
//     title: title,
//   }))
// );
//         } catch (err) {
//           console.log(err);
//         }
//       };
//       getData();
//     }
//     return () => {
//       subscribed = false;
//     };
//   }, [watchlist, watchStatusTag]);

//   console.log(watchcards);

//   return (
//     <div className="cards">
//       {currentList.length ? (
//         watchcards.map(({ id, poster_path, title }) => {
//           return (
//             <WatchCard
//               key={id}
//               id={id}
//               poster_path={poster_path}
//               title={title}
//               watchlist={watchlist}
//               setWatchlist={setWatchlist}
//             />
//           );
//         })
//       ) : (
//         <p className="empty-msg">No movies in your list, add some!</p>
//       )}

//       {/* <p className="empty-msg">No movies in your list, add some!</p> */}
//       {/*  <PulseLoader color="#fff" cssOverride={spinnerStyle} /> */}
//     </div>
//   );

// ! 舊的0
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

export default WatchCards;
