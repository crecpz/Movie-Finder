import { useEffect } from "react";
import { useState } from "react";
import DetailCard from "../components/DetailCard";
import { getData, removeDuplicate } from "../utils/function";
import { useInView } from "react-intersection-observer";
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

  // 搜尋電影的 API_URL
  const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}&page=${pageNum}`;

  // 當 watchlist 改變，更新 localStorage 值
  useEffect(() => {
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // 處理 search input 文字改變
  function handleSearchChange(e) {
    setSearchText(e.target.value);
    // console.log(searchText);
  }

  // console.log(searchText);

  useEffect(() => {
    let subscribed = true;
    if (searchText === "") {
      setSearchResult({});
      setPageNum(1);
    } else {
      if (subscribed) getData(API_URL, setSearchResult);
    }
    return () => {
      subscribed = false;
    };
  }, [searchText]);

  useEffect(() => {
    if (isIntersecting && searchResult) {
      setPageNum((prev) => prev + 1);
    }
  }, [isIntersecting]);

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
            results: removeDuplicate([...prev.results, ...data.results]),
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
  console.log("pageNum", pageNum);

  //* 搜尋結果 elements
  const searchResultElements = searchResult.results ? (
    searchResult.results.length === 0 ? (
      <p className="empty-msg">
        Sorry, no search result. Can't find what you're looking for.
      </p>
    ) : (
      searchResult.results.map((movie) => {
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

  return (
    <div className="search">
      <div className="search__input-wrapper">
        <input
          type="text"
          className="search__input"
          placeholder="Search for a movie..."
          onChange={handleSearchChange}
          value={searchText}
        />
        <button
          className={`btn search__clear-text-btn ${
            searchText ? "search__clear-text-btn--show" : ""
          }`}
          onClick={() => setSearchText("")}>
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
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

          {searchResult.results && pageNum <= searchResult.total_results && (
            <div ref={loadMore} className="spinner">
              <PulseLoader color="#fff" cssOverride={spinnerStyle} />
            </div>
          )}
        </ul>
      </div>
      <ScrollToTop
        smooth
        className="scroll-to-top"
        color="#fff"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </div>
  );
};

export default Search;
