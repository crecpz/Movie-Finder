import { useEffect, useState } from "react";
import DetailCard from "../components/DetailCard";
import { getData, removeDuplicate } from "../utils/function";
import { useInView } from "react-intersection-observer";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../utils/components-styles";
import ScrollToTop from "react-scroll-to-top";
import { useRef } from "react";

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

  //! pageNum 要特別注意，留意他何時要歸 1

  // 搜尋電影的 API_URL
  const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}&page=${pageNum}`;

  // 當 watchlist 改變，更新 localStorage 值
  useEffect(() => {
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  //* 監聽 Window click 事件
  useEffect(() => {
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

  // 處理 search input 文字改變
  function handleInputChange(e) {
    setSearchText(e.target.value);
  }

  //* 處理 search input 被鍵盤按下後的行為
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

  //* 處理 auto-complete__item onClick 觸發後的行為
  function handleAutoCompleteClick(text) {
    console.log(text)
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
    if (searchText.trim().length === 0) {
      // ! 看到這條，請思考是否要在 length === 0 的時候將 autoComplete 結果歸零
      setShowAutoComplete(false);
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

  // 處理 spinner 進入視窗範圍後的行為
  useEffect(() => {
    // 如果目前是 intersection 狀態，且目前 pageNum 還沒到達 API 提供的 total_pages 頁數
    // 則可繼續增加 pageNum 數值
    if (
      isIntersecting &&
      searchResult.results.length < searchResult.total_results
    ) {
      setPageNum((prev) => prev + 1);
    }
    // if (isIntersecting && pageNum !== searchResult.total_pages) {
    //   setPageNum((prev) => prev + 1);
    // }
  }, [isIntersecting]);

  // @舊版
  // // 處理 spinner 進入視窗範圍後的行為
  // useEffect(() => {
  //   if (isIntersecting && searchResult) {
  //     setPageNum((prev) => prev + 1);
  //   }
  // }, [isIntersecting]);

  //@ 目前想到! API 有一個 total_results 的屬性，可以用來比對，
  //@ 如果當前 searchResult.length !==  total_result 的話，
  //@ 代表 pageNum 有使用的必要，但是如果 searchResult.length ===  total_result
  //@ 則不需要增加。
  //! 甚至可以使用 total_pages 的屬性，更明確

  console.log(
    "searchText: ",
    searchText,
    "isIntersecting ?",
    isIntersecting,
    "pageNum: ",
    pageNum,
    "searchResult: ",
    searchResult
  );

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

  return (
    <div className="search">
      <div className="search__bar">
        <div className="search__input-wrapper">
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
            className={`btn search__clear-text-btn ${
              searchText ? "search__clear-text-btn--show" : ""
            }`}
            onClick={() => setSearchText("")}>
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
                        className="auto-complete__item"
                        onClick={() => handleAutoCompleteClick(searchText)}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        {searchText} <span>- Search</span>
                      </li>
                    );
                  }
                  return (
                    <li
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
      </div>

      <div className="container">
        <ul className="detail-cards">
          {searchResultElements}
          {/* spinner */}
          {searchText && !searchResult.results && (
            <div className="spinner">
              <PulseLoader color="#fff" cssOverride={spinnerStyle} />
            </div>
          )}

          {searchResult.results && pageNum !== searchResult.total_pages && (
            <div ref={loadMore} className="spinner">
              <PulseLoader color="#fff" cssOverride={spinnerStyle} />
            </div>
          )}

          {/* 舊款 */}
          {/* {searchResult.results && pageNum <= searchResult.total_results && (
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
