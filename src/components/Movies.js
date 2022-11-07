import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Genres from "../page/Genres";
import {
  capitalize,
  getData,
  getFirstDayAndLastDayOfMonth,
} from "../utils/function";
import MoviesCards from "./MoviesCards";

const Movies = () => {
  //! 暫時沒有使用下拉獲取更多資料的功能，因為之後會用 interSection API 寫

  // 存放取得的電影資料
  const [movies, setMovies] = useState([]);
  // 存放頁面，會隨著頁面的滾動而增加
  const [page, setPage] = useState(1);
  // 存放使用者目前點擊到的頁面參數
  const { type } = useParams();
  // 根據目前頁面參數來決定 URL 內容(下面使用 switch 判斷)
  let API_URL = "";

  const { genresId } = useParams();

  // page 拉到底時再次獲取
  // useEffect(() => {
  //   getData(API_URL, setMovies);
  // }, [page]);

  useEffect(() => {
    // getMovieData();
    getData(API_URL, setMovies);
  }, []);

  useEffect(() => {
    setMovies([]);
    // getMovieData();
    getData(API_URL, setMovies);
  }, [type]);

  // useEffect(() => {
  //   window.addEventListener("scroll", scrollHandler);
  // }, []);

  // function scrollHandler() {
  //   if (
  //     document.documentElement.scrollTop + window.innerHeight + 1 >=
  //     document.documentElement.scrollHeight
  //   ) {
  //     console.log(2);
  //     setPage((prev) => prev + 1);
  //   }
  // }

  switch (type) {
    case "new":
      const firstDate = getFirstDayAndLastDayOfMonth()[0];
      const lastDate = getFirstDayAndLastDayOfMonth()[1];
      API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&primary_release_date.gte=${firstDate}&primary_release_date.lte=${lastDate}&page=${page}`;
      break;

    case "popular":
      API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=e86818f56e7d92f357708ecb03052800&page=${page}`;
      // ? 嘗試獲取後面一點的頁數，一樣有重複的情形
      break;

    case "genres":
      API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${genresId}`;
  }

  return (
    <div className="movies">
      <div className="container">
        <h2 className="layout-title">{capitalize(type)}</h2>
        {type === "genres" && <Genres />}
        <MoviesCards movies={movies} />
      </div>
    </div>
  );
};

export default Movies;
