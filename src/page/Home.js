import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useInView } from "react-intersection-observer";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData } from "../utils/function";
import MovieSwiper from "../components/MovieSwiper";
import { spinnerStyle } from "../utils/components-styles";

const Home = () => {
  // 存放趨勢 movie
  const [trendingMovies, setTrendingMovies] = useState([]);
  // 趨勢 API_URL (取得趨勢 movie, 24hr 更新一次)
  const TRENDING_URL =
    "https://api.themoviedb.org/3/trending/movie/day?api_key=e86818f56e7d92f357708ecb03052800";
  // 類別 API_URL (取得類別 id 與對應的名稱)
  const GENRES_URL =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e86818f56e7d92f357708ecb03052800";
  // 類別資料
  const [genresData, setGenresData] = useState([]);
  const { ref: loadMore, inView: isIntersecting } = useInView();
  const [showAmount, setShowAmount] = useState(3);
  // 第一張輪播圖的載入狀態
  const [imgIsLoaded, setImgIsLoaded] = useState(false);

  useEffect(() => {
    if (isIntersecting) {
      setShowAmount((prev) => prev + 4);
    }
  }, [isIntersecting]);

  useEffect(() => {
    let subscribed = true;
    if (subscribed) {
      getData(TRENDING_URL, setTrendingMovies);
      getData(GENRES_URL, setGenresData);
    }
    return () => {
      subscribed = false;
    };
  }, []);

  // * 處理 img 讀取完成的事件
  function handleImgLoaded() {
    // 變更狀態為 true (表示已經讀取好)
    setImgIsLoaded(true);
  }

  // * 輪播
  const carouselElements = trendingMovies.results
    ? trendingMovies.results.map((movie, index) => {
        return (
          <Link to={`/movie/${movie.id}`} className="carousel" key={movie.id}>
            <div className="carousel__img">
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                className="carousel__backdrop"
                alt="movie-backdrop"
                onLoad={() => {
                  // 檢查第一張輪播 backdrop 是否已被載入
                  index === 0 && handleImgLoaded();
                }}
              />
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                className="carousel__poster"
                alt="movie-poster"
                onLoad={() => {
                  // 檢查第一張輪播 backdrop 是否已被載入
                  index === 0 && handleImgLoaded();
                }}
              />
            </div>
            <div className="carousel__text">
              <h3 className="carousel__title">
                {movie.original_title ? movie.original_title : ""}
              </h3>
              <div className="carousel__info">
                <p className="carousel__release-date">
                  {movie.release_date ? movie.release_date : ""}
                </p>
                <p className="carousel__vote">
                  {movie.vote_average ? movie.vote_average : ""}
                  <i className="fa-solid fa-star"></i>
                </p>
              </div>
              <p className="carousel__overview">
                {movie.overview ? movie.overview : ""}
              </p>
            </div>
          </Link>
        );
      })
    : "";

  // * genres swiper
  const MovieSwiperElements =
    genresData.genres &&
    genresData.genres.map((genres, index) => {
      return (
        <MovieSwiper
          key={genres.id}
          id={genres.id}
          {...genres}
          show={index <= showAmount}
        />
      );
    });

  return (
    <section className="home">
      <div className={`spinner-full-screen ${!imgIsLoaded && "active"}`}>
        <PulseLoader color="#fff" cssOverride={spinnerStyle} />
      </div>

      <Carousel
        showThumbs={false}
        autoPlay={true}
        transitionTime={3}
        infiniteLoop={true}
        showStatus={false}>
        {carouselElements}
      </Carousel>

      <div className="home__genres">
        {MovieSwiperElements}
        {genresData.genres && showAmount <= genresData.genres.length && (
          <div ref={loadMore} className="spinner">
            <PulseLoader color="#fff" cssOverride={spinnerStyle} />
          </div>
        )}
      </div>
      <ScrollToTop
        smooth
        className="scroll-to-top"
        color="#fff"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </section>
  );
};

export default Home;
