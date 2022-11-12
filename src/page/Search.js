import { useEffect } from "react";
import { useState } from "react";
import DetailCard from "../components/DetailCard";
import { getData, getMoreData, removeDuplicate } from "../utils/function";
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
  // ! - 注意，這樣的寫法只會讓使用者在輸入第二個字的時候開始搜尋，第一個字不搜尋
  // ! - 關於複製貼上也必須注意
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (searchText !== "") {
      getData(API_URL, setSearchResult);
    } else {
      setSearchResult({});
    }
  }, [searchText]);

  useEffect(() => {
    if (isIntersecting && searchResult) {
      setPageNum((prev) => prev + 1);
      getMoreData(API_URL, setSearchResult);
      console.log(searchResult);
    }
  }, [isIntersecting]);

  // useEffect(() => {
  // }, [pageNum]);

  // ! 留意 inWatchlist
  const searchResultElements = searchResult.results ? (
    searchResult.results.length === 0 ? (
      <span className="empty-msg">Sorry, no search result. Can't find what you're looking for.</span>
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

/*
movie.poster_path ? (
      <Link to={`/movie/${movie ? movie.id : ""}`} className="detail-card-link">
        <div className="detail-card">
          <img
            className="detail-card__img"
            src={`https://image.tmdb.org/t/p/w300/${
              movie && movie.poster_path
            }`}
            alt="move-card-img"
          />
          <div className="detail-card__text">
            <h3 className="detail-card__title">
              {movie ? movie.original_title : ""}
            </h3>
            <div className="detail-card__info">
              <p className="detail-card__release-date">
                {movie ? movie.release_date : ""}
              </p>
              <p className="detail-card__vote">
                {movie ? movie.vote_average : ""}
                <i className="fa-solid fa-star"></i>
              </p>
            </div>
          </div>
        </div>
      </Link>
*/
