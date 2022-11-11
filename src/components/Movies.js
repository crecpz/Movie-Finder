import React, { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import {
  capitalize,
  getData,
  getFirstDayAndLastDayOfMonth,
} from "../utils/function";
import GenresSwiper from "./GenresSwiper";
import MoviesCard from "./MoviesCard";
import { useRef } from "react";

const Movies = () => {
  // ! 留意嚴格模式 (index.js)
  const { ref: loadMore, inView: isIntersecting } = useInView();
  const [loading, setLoading] = useState(false);

  // 存放取得的電影資料
  const [movies, setMovies] = useState([]);
  // const [movies, setMovies] = useState([]);
  // 存放使用者目前點擊到的頁面參數
  const { type } = useParams();
  // 根據目前頁面參數來決定 URL 內容(下面使用 switch 判斷)
  let API_URL = "";
  // 在網址中取得 genresId
  const { genresId } = useParams();

  // 存放頁面數字
  const [pageNum, setPageNum] = useState(1);

  switch (type) {
    case "new":
      const firstDate = getFirstDayAndLastDayOfMonth()[0];
      const lastDate = getFirstDayAndLastDayOfMonth()[1];
      API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&primary_release_date.gte=${firstDate}&primary_release_date.lte=${lastDate}&page=${pageNum}`;
      break;

    case "popular":
      API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=e86818f56e7d92f357708ecb03052800&page=${pageNum}`;
      // ? 嘗試獲取後面一點的頁數，一樣有重複的情形
      // console.log("page: ", pageNum);
      break;

    case "genres":
      API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${genresId}`;
      break;
  }

  const getMoreData = async (API_URL, setState) => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("Error");
      }

      const data = await res.json();

      setState((prev) => {
        return [...prev, ...data.results];
      });

      setPageNum(prev => prev+1)

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setMovies([]);
    getMoreData(API_URL, setMovies);
  }, [type, genresId]);

  useEffect(() => {
    if (isIntersecting) {
      getMoreData(API_URL, setMovies);
    }
  }, [isIntersecting]);

  const override = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  return (
    <div className="movies">
      <div className="container">
        <h2 className="layout-title">{capitalize(type)}</h2>
        {type === "genres" && <GenresSwiper />}
        <div className="movies-cards">
          {movies ? (
            movies.map((movie) => {
              return <MoviesCard key={movie.id} movie={movie} />;
            })
          ) : (
            <PulseLoader color="#fff" cssOverride={override} />
          )}
        </div>

        {movies.length !== 0 && (
          <div ref={loadMore} className="load-more">
            <PulseLoader color="#fff" cssOverride={override} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
