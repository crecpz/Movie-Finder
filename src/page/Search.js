import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DetailCard from "../components/DetailCard";
import { getData } from "../functions/function";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState({});
  // const searchResult


  // ! 注意，這樣的寫法只會讓使用者在輸入第二個字的時候開始搜尋，第一個字不搜尋
  // ! 所以關於檢查目前是否有內容應該是要看 keyup
  function changeInput(e) {
    e.preventDefault();
    setSearchText(e.target.value);

    const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=e86818f56e7d92f357708ecb03052800&query=${searchText}`;

    // 只要 input 內有內容就嘗試進行搜尋
    if (e.target.value !== "") {
      getData(API_URL, setSearchResult);
    } else {
      // 否則不進行搜尋
      setSearchResult({});
    }
  }

  const searchResultElements =
    searchResult && searchResult.results
  ? searchResult.results.length === 0
    ? "no result"
    : searchResult.results.map((movie) => {
        return <DetailCard movie={movie} />;
      })
      : "";

  // "No Result"
  // .length !== 0

  function a() {
    console.log("a");
  }

  return (
    <div className="search">
      <div className="container">
        <input
          type="text"
          className="search__input"
          placeholder="Search for a movie"
          onChange={changeInput}
          value={searchText}
          onCompositionEnd={a}
        />
        <ul className="detail-cards">{searchResultElements}</ul>
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
