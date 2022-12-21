import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { spinnerStyle } from "../../utils/components-styles";
import { useNavigate, useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import {
  capitalize,
  getFirstDayAndLastDay,
  getMoreData,
} from "../../utils/function";
import ScrollToTop from "react-scroll-to-top";
import GenresSwiper from "../../components/GenresSwiper/GenresSwiper";
import MoviesCard from "../../components/MoviesCards/MoviesCards";
import genresIconsData from "../../utils/genresIconsData";

const Movies = () => {
  const navigate = useNavigate();
  // intersection observer
  const { ref: loadMore, inView: isIntersecting } = useInView();
  // 存放取得的電影資料
  const [movies, setMovies] = useState([]);
  // 根據目前頁面參數來決定 URL 內容(下面使用 switch 判斷)
  let API_URL = "";
  // 在網址中取得 genresId
  const { genresId } = useParams();
  // 存放頁面數字
  const [pageNum, setPageNum] = useState(1);
  // 網址參數: 從網址列判斷目前位於哪頁
  const { type } = useParams();

  // const type = ""
  //* 根據目前 url :type，來決定 API_URL 為何
  switch (type) {
    case "new":
      const firstDate = getFirstDayAndLastDay()[0];
      const lastDate = getFirstDayAndLastDay()[1];
      API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&primary_release_date.gte=${firstDate}&primary_release_date.lte=${lastDate}&page=${pageNum}`;
      break;
    case "popular":
      API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=e86818f56e7d92f357708ecb03052800&page=${pageNum}`;
      break;
    case "genres":
      // 注意: 會先檢查網址，如果網址是 undefined，就給他預設值 28 (Action 類別的代號)
      API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${
        genresId || 28
      }&page=${pageNum}`;
      break;
  }

  //* 切換頁面
  useEffect(() => {
    let subscribed = true;
    // 清空目前存放的 movies state 內容
    setMovies([]);
    // 設定目前頁面為 1
    setPageNum(1);
    // 按下切換類別(type)之後，等到 pageNum 確實變成 1 之後才獲取該頁資料
    if (pageNum === 1 && subscribed) getMoreData(API_URL, setMovies);
    return () => {
      subscribed = false;
    };
  }, [type, genresId]);

  //* 當指定的 Ref 進入畫面中
  useEffect(() => {
    // 將 pageNum + 1
    if (isIntersecting) setPageNum((prev) => prev + 1);
  }, [isIntersecting]);

  //* 偵測 pageNum 變化
  useEffect(() => {
    let subscribed = true;
    if (subscribed) getMoreData(API_URL, setMovies);
    return () => {
      subscribed = false;
    };
  }, [pageNum]);

  //* 如果當前所在的頁面為 "genres"，且在 genresIconsData.js 找不到相對應的 genres id...
  useEffect(() => {
    if (type === "genres" && genresId && !genresIconsData[genresId]) {
      // 代表不存在此頁，跳轉到 notfound 頁面
      navigate("/notfound", { replace: true });
    }
  }, [genresId]);

  return (
    <section className="movies">
      <div className="container">
        <h2 className="layout-title">{capitalize(type)}</h2>
        {/* 若為 Genres 頁面，則顯示 <GenresSwiper /> */}
        {type === "genres" && <GenresSwiper />}
        {/* MovieCards */}
        <div className="movies-cards cards">
          {movies.length !== 0 ? (
            movies.map((movie) => {
              return <MoviesCard key={movie.id} movie={movie} />;
            })
          ) : (
            <PulseLoader color="#fff" cssOverride={spinnerStyle} />
          )}
        </div>

        {/* load more spinner */}
        {movies.length !== 0 && (
          <div ref={loadMore} className="spinner spinner--full-screen">
            <PulseLoader color="#fff" cssOverride={spinnerStyle} />
          </div>
        )}
      </div>

      {/* 滾動到頂部 */}
      <ScrollToTop
        smooth
        className="scroll-to-top"
        width="20"
        height="20"
        color="#000"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </section>
  );
};

export default Movies;
