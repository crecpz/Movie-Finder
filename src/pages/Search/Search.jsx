import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SearchResult from "../../components/SearchResult/SearchResult";
import { getData, getMoreData, removeDuplicate } from "../../utils/function";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../../utils/components-styles";
import ScrollToTop from "react-scroll-to-top";

const Search = ({ watchlist, setWatchlist, setUnreadList }) => {
  // loadMore intersection ref
  const { ref: loadMore, inView: isIntersecting } = useInView();
  // 存放搜尋框輸入的文字
  const [searchText, setSearchText] = useState("");
  // 存放搜尋結果
  const [searchResult, setSearchResult] = useState({});
  // 當前載入頁數
  const [pageNum, setPageNum] = useState(1);
  // 存放使用者在 input 輸入的過程中 fetch 到的 autoComplete 選項
  const [autoComplete, setAutoComplete] = useState([]);
  // autoComplete ui 顯示狀態(true:顯示, false: 隱藏)
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  // 表示目前是否開始進行搜尋(當「鍵盤按下 Enter」 或是 「click 首項 autoCompleteItems」，將會變成 true)
  const [startSearching, setStartSearching] = useState(false);
  // 存放 input ref
  const inputRef = useRef(null);
  // 搜尋電影的 API_URL
  const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}&page=${pageNum}`;

  //* 偵測 searchText 改變
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
        const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}`;
        // 利用使用者輸入的文字內容進行搜尋，獲取 autoComplete 資料，存入 autoComplete state
        getData(API_URL, setAutoComplete);
        // 允許顯示 autoComplete ui
        setShowAutoComplete(true);
      }
    }
    // cleanup function
    return () => {
      subscribed = false;
    };
  }, [searchText]);

  //* 偵測目前是否為 startSearching 狀態，若為 true 則開始進行搜尋
  useEffect(() => {
    if (startSearching) {
      const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}`;
      getData(API_URL, setSearchResult);
      // 新的搜尋產生後，滾動到頂部
      window.scrollTo(0, 0);
      // 將 pageNum 回歸 1
      setPageNum(1);
      // 隱藏 autoComplete
      setShowAutoComplete(false);
    }
    // cleanup function
    return () => setStartSearching(false);
  }, [startSearching, searchText]);

  //* 偵測 loadMore 是否進入 intersection observer
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
    let subscribed = true;
    // 獲取更多資料的行為只發生在 pageNum > 1
    if (subscribed && pageNum > 1) {
      getMoreData(API_URL, setSearchResult);
    }
    // cleanup function
    return () => (subscribed = false);
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
    // cleanup function
    return () => window.removeEventListener("click", hideAutoComplete);
  }, []);

  //* autoComplete elements
  const autoCompleteItems = autoComplete.results
    ? removeDuplicate(autoComplete.results, "title")
        .filter(({ original_title }) => original_title !== searchText)
        .slice(0, 8)
    : [];

  //* 搜尋結果 elements
  let searchResultElements = searchResult.results ? (
    searchResult.results.length === 0 ? (
      <p className="empty-msg">
        Sorry, no search result. Can't find what you're looking for.
      </p>
    ) : (
      removeDuplicate(searchResult.results, "title").map((movie) => {
        return (
          <SearchResult
            key={movie.id}
            movie={movie}
            inWatchlist={watchlist.some(
              (watchlistData) => watchlistData.id === movie.id
            )}
            setWatchlist={setWatchlist}
            setUnreadList={setUnreadList}
          />
        );
      })
    )
  ) : (
    ""
  );

  //* 處理 search input 文字改變
  function handleInputChange(e) {
    setSearchText(e.target.value);
  }

  //* 處理 search input 鍵盤按下後的行為
  function handleKeyUp(e) {
    // 如果在 input 有文字內容的情況下按下 Enter
    if (e.key === "Enter" && searchText.trim().length !== 0) {
      // startSearching state 設為 true
      setStartSearching(true);
    }
  }

  /**
   ** 處理 autoComplete 選項的點擊行為(使用者過 click auto-complete__item 來搜尋)
   * @param {*} resultId 點擊元素的 id
   * @param {*} resultTitle 點擊元素的電影名稱
   */
  function handleAutoCompleteClick(resultId, resultTitle) {
    // 將 input 文字改成點擊到的字
    setSearchText(resultTitle);
    // 從 autoComplete state 當中，找出目前點擊到的 autoCompleteItems 物件
    const result = autoComplete.results.find(({ id }) => id === resultId);
    // 加入到 searchResult state 中
    setSearchResult({ results: [result] });
  }

  return (
    <div className="search">
      <div className="container">
        <div className="search-bar">
          <div className="search-bar__input-wrapper">
            <input
              type="text"
              ref={inputRef}
              className="search-bar__input"
              placeholder="Search for a movie..."
              value={searchText}
              onChange={handleInputChange}
              onKeyUp={handleKeyUp}
              onFocus={() => {
                if (searchText) setShowAutoComplete(true);
              }}
            />
            <button
              className={`btn search-bar__clear-btn ${
                searchText ? "search-bar__clear-btn--show" : ""
              }`}
              onClick={() => setSearchText("")}>
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          </div>

          {/* auto-complete */}
          <ul
            className={`auto-complete ${
              showAutoComplete ? "auto-complete--show" : ""
            }`}>
            {autoComplete.results
              ? [searchText, ...autoCompleteItems].map((result, index) => {
                  // 首項為使用者輸入的內容
                  if (index === 0) {
                    return (
                      <li
                        key={result.id}
                        id={result.id}
                        className="auto-complete__item"
                        onClick={() => setStartSearching(true)}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        {searchText} <span>- Search</span>
                      </li>
                    );
                  }
                  // 其餘選項使用使用者輸入的內容來獲取電影，並呈現該電影的「 original_title 」
                  return (
                    <li
                      key={result.id}
                      id={result.id}
                      className="auto-complete__item"
                      onClick={() =>
                        handleAutoCompleteClick(
                          result.id,
                          result.original_title
                        )
                      }>
                      <i className="fa-solid fa-magnifying-glass"></i>
                      {result.original_title}
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>

        <ul className="search-results">
          {/* ! spinner */}
          {/* {searchResult.results && searchResult.results.length === 0 && (
            <div className="spinner">
              <PulseLoader color="#fff" cssOverride={spinnerStyle} />
            </div>
          )} */}

          {searchResultElements}
        </ul>
        {/* loadMore spinner */}
        {searchResult.results && searchResult.total_pages
          ? pageNum !== searchResult.total_pages && (
              <div ref={loadMore} className="spinner">
                <PulseLoader color="#fff" cssOverride={spinnerStyle} />
              </div>
            )
          : ""}
      </div>
      {/* ScrollToTop */}
      <ScrollToTop
        smooth
        className="scroll-to-top"
        width="20"
        height="20"
        color="#000"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </div>
  );
};

export default Search;
