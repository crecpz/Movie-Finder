import { useEffect } from "react";
import { useState } from "react";
import DetailCard from "../components/DetailCard";
import { getData, removeDuplicate } from "../utils/function";
import { useInView } from "react-intersection-observer";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../utils/components-styles";
const Search = ({ watchlist, setWatchlist }) => {
  const { ref: loadMore, inView: isIntersecting } = useInView();
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState({});
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

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
          results: removeDuplicate(prev.results, data.results),
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}&page=${pageNum}`;

  // ! - 關於複製貼上也必須跑出搜尋結果
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    let subscribed = true;
    if (searchText === "") {
      setSearchResult({});
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
    let subscribed = true;
    // 僅在目前頁面 > 1 時才進行獲取
    if (pageNum > 1 && subscribed) getMoreData(API_URL, setSearchResult);
    return () => {
      subscribed = false;
    };
  }, [pageNum]);

  const searchResultElements = searchResult.results ? (
    searchResult.results.length === 0 ? (
      <span className="empty-msg">
        Sorry, no search result. Can't find what you're looking for.
      </span>
    ) : (
      searchResult.results.map((movie) => {
        return (
          <DetailCard
            key={movie.id}
            movie={movie}
            inWatchlist={watchlist.some(
              (watchlistData) => String(movie.id) === watchlistData.id
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
      <div className="container">
        <input
          type="text"
          className="search__input"
          placeholder="Search for a movie"
          onChange={handleSearchChange}
          value={searchText}
        />
        <ul className="detail-cards">
          {searchResultElements}

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
    </div>
  );
};

export default Search;