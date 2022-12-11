import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import DetailCard from "../components/DetailCard";
import { getData, removeDuplicate } from "../utils/function";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../utils/components-styles";
import ScrollToTop from "react-scroll-to-top";

const Search = ({ watchlist, setWatchlist }) => {
  const { ref: loadMore, inView: isIntersecting } = useInView();
  // 存放搜尋框輸入的文字
  const [searchText, setSearchText] = useState("");
  // 存放搜尋結果
  const [searchResult, setSearchResult] = useState({});
  // 搜尋結果頁數
  const [pageNum, setPageNum] = useState(1);

  // ? 存放 input ref
  const inputRef = useRef(null);

  // ? 存放 autoComplete 選項
  const [autoComplete, setAutoComplete] = useState([]);

  // ? autoComplete ui 顯示狀態
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  //? 用來表示當前是否使用點擊的方式來進行搜尋
  const [clickingAutoCompleteItem, setClickingAutoCompleteItem] =
    useState(false);

  // 搜尋電影的 API_URL
  const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}&page=${pageNum}`;

  //* 處理 search input 文字改變
  function handleInputChange(e) {
    setSearchText(e.target.value);
  }

  //* 處理 .search__clear-btn 按下後的行為
  function handleClearBtnClick() {
    // 將 input 文字清除
    setSearchText("");
    // 將 pageNum 設為 1
    setPageNum(1);
  }

  //* 處理 search input 鍵盤按下後的行為(使用者用 Enter 來搜尋)
  function handleKeyUp(e) {
    // 如果使用者輸入完後按下 Enter
    if (e.key === "Enter") {
      // 獲取搜尋資料
      getData(API_URL, setSearchResult);
      // 新的搜尋產生後，滾動到頂部
      window.scrollTo(0, 0);
      // 將 pageNum 回歸 1
      setPageNum(1);
      // 隱藏 autoComplete
      setShowAutoComplete(false);
    }
  }

  //* 處理 autoComplete 選項的點擊行為(使用者用點擊 auto-complete__item 來搜尋)
  function handleAutoCompleteClick(text) {
    getData(API_URL, setSearchResult);
    // 新的搜尋產生後，滾動到頂部
    window.scrollTo(0, 0);
    setClickingAutoCompleteItem(true);
    setShowAutoComplete(false);
    setSearchText(text);
    // 將 pageNum 回歸 1
    setPageNum(1);
  }

  useEffect(() => {
    let subscribed = true;
    // 當 inptu 為空
    if (searchText.trim().length === 0) {
      // 關閉 autoComplete 選項
      setShowAutoComplete(false);
      // 將 pageNum 設為 1
      setPageNum(1);
    } else {
      if (subscribed) {
        getData(API_URL, setAutoComplete);
        setClickingAutoCompleteItem(false);
      }
      if (!clickingAutoCompleteItem) setShowAutoComplete(true);
    }
    return () => {
      subscribed = false;
    };
  }, [searchText]);

  //--- old
  // //* 處理 spinner 進入視窗範圍後的行為
  // useEffect(() => {
  //   // 如果目前是 intersection 狀態，且目前 pageNum 還沒到達 API 提供的 total_pages 頁數
  //   // 則可繼續增加 pageNum 數值
  //   if (
  //     isIntersecting &&
  //     searchResult.results.length < searchResult.total_results
  //   ) {
  //     setPageNum((prev) => prev + 1);
  //   }
  // }, [isIntersecting]);
  //--- old
  useEffect(() => {
    // 如果目前是 intersection 狀態，且目前 pageNum 還沒到達 API 提供的 total_pages 頁數
    // 則可繼續增加 pageNum 數值
    if (
      isIntersecting &&
      (searchResult.results.length < searchResult.total_results ||
        pageNum < searchResult.total_pages)
    ) {
      setPageNum((prev) => prev + 1);
    }
  }, [isIntersecting]);

  //* pageNum 改變後的行為
  useEffect(() => {
    // 取得更多的搜尋結果
    const getMoreData = async (API_URL, setState) => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error("Error");
        }
        const data = await res.json();
        setState((prev) => {
          return {
            ...prev,
            results: removeDuplicate([...prev.results, ...data.results], "id"),
          };
        });
      } catch (err) {
        console.log(err);
      }
    };
    let subscribed = true;
    // 僅在目前頁面 > 1 時才進行獲取
    if (pageNum > 1 && subscribed) getMoreData(API_URL, setSearchResult);
    return () => {
      subscribed = false;
    };
  }, [pageNum]);

  //* 當 watchlist 改變，更新 localStorage 值
  useEffect(() => {
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  //* 監聽 Window click 事件
  useEffect(() => {
    // 點任何處來關閉 autoComplete
    const hideAutoComplete = (e) => {
      if (e.target !== inputRef.current) {
        setShowAutoComplete(false);
      }
    };
    window.addEventListener("click", hideAutoComplete);
    // clean func
    return () => {
      window.removeEventListener("click", hideAutoComplete);
    };
  }, []);

  //* autoComplete elements
  const autoCompleteItems = autoComplete.results
    ? removeDuplicate(autoComplete.results, "title")
        .filter(({ title }) => title !== searchText)
        .slice(0, 8)
    : [];

  //* 搜尋結果 elements
  const searchResultElements = searchResult.results ? (
    searchResult.results.length === 0 ? (
      <p className="empty-msg">
        Sorry, no search result. Can't find what you're looking for.
      </p>
    ) : (
      removeDuplicate(searchResult.results, "title").map((movie) => {
        return (
          <DetailCard
            key={movie.id}
            movie={movie}
            inWatchlist={watchlist.some(
              (watchlistData) => movie.id === watchlistData.id
            )}
            setWatchlist={setWatchlist}
          />
        );
      })
      // searchResult.results.map((movie) => {
      //   return (
      //     <DetailCard
      //       key={movie.id}
      //       movie={movie}
      //       inWatchlist={watchlist.some(
      //         (watchlistData) => movie.id === watchlistData.id
      //       )}
      //       setWatchlist={setWatchlist}
      //     />
      //   );
      // })
    )
  ) : (
    ""
  );

  console.log(
    "searchText: ",
    searchText,
    "\n",
    "isIntersecting ?",
    isIntersecting,
    "\n",
    "pageNum: ",
    pageNum,
    "\n",
    "searchResult: ",
    searchResult
  );

  return (
    <div className="search">
      <div className="container">
        <div className="search__bar">
          <input
            type="text"
            ref={inputRef}
            className="search__input"
            placeholder="Search for a movie..."
            value={searchText}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            onFocus={() => {
              if (searchText) setShowAutoComplete(true);
            }}
            // onBlur={() => {
            //   console.log("onBlur");
            //   setShowAutoComplete(false);
            // }}
            // onFocus={() => setShowAutoComplete(true)}
            // onBlur={() => setShowAutoComplete(false)}
          />
          <button
            className={`btn search__clear-btn ${
              searchText ? "search__clear-btn--show" : ""
            }`}
            onClick={handleClearBtnClick}>
            <i className="fa-solid fa-circle-xmark"></i>
          </button>

          {/* auto-complete */}
          <ul
            className={`auto-complete ${
              showAutoComplete ? "auto-complete--show" : ""
            }
            `}>
            {autoComplete.results
              ? [searchText, ...autoCompleteItems].map((res, index) => {
                  if (index === 0) {
                    return (
                      <li
                        key={index}
                        className="auto-complete__item"
                        onClick={() => handleAutoCompleteClick(searchText)}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        {searchText} <span>- Search</span>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={index}
                      className="auto-complete__item"
                      onClick={() => handleAutoCompleteClick(res.title)}>
                      <i className="fa-solid fa-magnifying-glass"></i>
                      {res.title}
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>

        <ul className="detail-cards">
          {searchResultElements}
          {/*! spinner(已經不需要，但是 fetch 過程中可能要) */}
          {/* {searchText && !searchResult.results && (
            <div className="spinner">
              <PulseLoader color="#fff" cssOverride={spinnerStyle} />
            </div>
          )} */}

          {/* loadMore spinner */}
          {searchResult.results
            ? searchResult.results.length !== 0 &&
              pageNum !== searchResult.total_pages && (
                <div ref={loadMore} className="spinner">
                  <PulseLoader color="#fff" cssOverride={spinnerStyle} />
                </div>
              )
            : ""}

          {/* {searchResult.results && pageNum !== searchResult.total_pages && (
            <div ref={loadMore} className="spinner">
              <PulseLoader color="#fff" cssOverride={spinnerStyle} />
            </div>
          )} */}
        </ul>
      </div>
      <ScrollToTop
        smooth
        className="scroll-to-top"
        color="#000"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </div>
  );
};

export default Search;

// return (
//   <div className="search">
//     <div className="search__bar">
//       <div className="search__input-wrapper">
//         <input
//           type="text"
//           ref={inputRef}
//           className="search__input"
//           placeholder="Search for a movie..."
//           value={searchText}
//           onChange={handleInputChange}
//           onKeyUp={handleKeyUp}
//           onFocus={() => {
//             if (searchText) setShowAutoComplete(true);
//           }}
//           // onBlur={() => {
//           //   console.log("onBlur");
//           //   setShowAutoComplete(false);
//           // }}
//           // onFocus={() => setShowAutoComplete(true)}
//           // onBlur={() => setShowAutoComplete(false)}
//         />
//         <button
//           className={`btn search__clear-btn ${
//             searchText ? "search__clear-btn--show" : ""
//           }`}
//           onClick={() => setSearchText("")}>
//           <i className="fa-solid fa-circle-xmark"></i>
//         </button>

//         {/* auto-complete */}
//         <ul
//           className={`auto-complete ${
//             showAutoComplete ? "auto-complete--show" : ""
//           }
//           `}>
//           {autoComplete.results
//             ? [searchText, ...autoCompleteItems].map((res, index) => {
//                 if (index === 0) {
//                   return (
//                     <li
//                       key={index}
//                       className="auto-complete__item"
//                       onClick={() => handleAutoCompleteClick(searchText)}>
//                       <i className="fa-solid fa-magnifying-glass"></i>
//                       {searchText} <span>- Search</span>
//                     </li>
//                   );
//                 }
//                 return (
//                   <li
//                     key={index}
//                     className="auto-complete__item"
//                     onClick={() => handleAutoCompleteClick(res.title)}>
//                     <i className="fa-solid fa-magnifying-glass"></i>
//                     {res.title}
//                   </li>
//                 );
//               })
//             : ""}
//         </ul>
//       </div>
//     </div>

//     <div className="container">
//       <ul className="detail-cards">
//         {searchResultElements}
//         {/* spinner */}
//         {searchText && !searchResult.results && (
//           <div className="spinner">
//             <PulseLoader color="#fff" cssOverride={spinnerStyle} />
//           </div>
//         )}

//         {searchResult.results && pageNum !== searchResult.total_pages && (
//           <div ref={loadMore} className="spinner">
//             <PulseLoader color="#fff" cssOverride={spinnerStyle} />
//           </div>
//         )}

//         {/* 舊款 */}
//         {/* {searchResult.results && pageNum <= searchResult.total_results && (
//           <div ref={loadMore} className="spinner">
//             <PulseLoader color="#fff" cssOverride={spinnerStyle} />
//           </div>
//         )} */}
//       </ul>
//     </div>
//     <ScrollToTop
//       smooth
//       className="scroll-to-top"
//       color="#000"
//       viewBox="0 0 448 512"
//       svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
//     />
//   </div>
// );
