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
  const [startSearching, setStartSearching] = useState(false);

  //? 存放 autoComplete 的 ref
  const autoCompleteRef = useRef();

  // 搜尋電影的 API_URL
  const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}&page=${pageNum}`;

  useEffect(() => {
    if (startSearching) {
      getData(API_URL, setSearchResult);
    }
    // 新的搜尋產生後，滾動到頂部
    window.scrollTo(0, 0);
    // 將 pageNum 回歸 1
    setPageNum(1);
    // 隱藏 autoComplete
    setShowAutoComplete(false);
    return () => setStartSearching(false);
  }, [startSearching]);

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
        setShowAutoComplete(true);
      }
    }
    return () => {
      subscribed = false;
    };
  }, [searchText]);

  useEffect(() => {
    if (
      isIntersecting && // 如果目前是 intersection 狀態
      pageNum < searchResult.total_pages // 且目前 pageNum < 搜尋結果的頁數
    ) {
      setPageNum((prev) => prev + 1);
    }
  }, [isIntersecting]);

  //* pageNum 改變後的行為
  useEffect(() => {
    // 取得更多的搜尋結果
    const getMoreData = async (API_URL, setState) => {
      console.log("API_URL from getMoreData()", API_URL);
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
    // 僅在目前頁面 > 1 時才進行獲取
    let subscribed = true;
    if (pageNum > 1 && subscribed) {
      getMoreData(API_URL, setSearchResult);
    }
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
    // 進入搜尋頁面後，focus() input
    inputRef.current.focus();
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

  // console.log(autoComplete);

  //* 搜尋結果 elements
  let searchResultElements = searchResult.results ? (
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
    )
  ) : (
    ""
  );

  // console.log(" searchResult.results: ", searchResult.results);

  //* 處理 search input 文字改變
  function handleInputChange(e) {
    setSearchText(e.target.value);
  }

  //* 處理 search input 鍵盤按下後的行為
  function handleKeyUp(e) {
    // 如果使用者輸入完後按下 Enter
    if (e.key === "Enter") {
      // startSearching state 設為 true
      setStartSearching(true);
    }

    // Search.js:176 ArrowDown
    // ArrowUp

    if (showAutoComplete) {
      const autoCompleteItemAmount = autoCompleteRef.current.children.length;
      let currentActiveItemIndex = 0;

      // console.log(autoCompleteRef.current);

      // autoCompleteRef.current.children[0].classList.add(
      //   "auto-complete__item--active"
      // );

      // console.log(autoCompleteRef.current.children[0]);
      // console.log(
      // autoCompleteRef.current.children[0].classList.add(
      //   "auto-complete__item--active"
      // )
      // );
      if (e.key === "ArrowDown") {
        currentActiveItemIndex++;
        // console.log(currentActiveItemIndex);
        console.log("down");
      }
      if (e.key === "ArrowUp") {
        console.log("up");
      }
    }
  }

  //* 處理 autoComplete 選項的點擊行為(使用者過 click auto-complete__item 來搜尋)
  function handleAutoCompleteClick(resultId, resultTitle) {
    const result = autoComplete.results.find(({ id }) => id === resultId);
    setSearchResult({ results: [result] });

    // todo 將 input 文字改成點擊到的字
    setSearchText(resultTitle);
  }

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
          />
          <button
            className={`btn search__clear-btn ${
              searchText ? "search__clear-btn--show" : ""
            }`}
            onClick={() => setSearchText("")}>
            <i className="fa-solid fa-circle-xmark"></i>
          </button>

          {/* auto-complete */}
          <ul
            ref={autoCompleteRef}
            className={`auto-complete ${
              showAutoComplete ? "auto-complete--show" : ""
            }
            `}>
            {autoComplete.results
              ? [searchText, ...autoCompleteItems].map((res, index) => {
                  if (index === 0) {
                    return (
                      <li
                        key={res.id}
                        id={res.id}
                        className="auto-complete__item"
                        onClick={() => setStartSearching(true)}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        {searchText} <span>- Search</span>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={res.id}
                      id={res.id}
                      className="auto-complete__item"
                      onClick={() =>
                        handleAutoCompleteClick(res.id, res.title)
                      }>
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
          {searchResult.results && searchResult.total_pages
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
