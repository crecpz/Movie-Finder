import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData } from "../functions/function";
import MovieSwiper from "../components/MovieSwiper";

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  // 取得趨勢 movie, 24hr 更新一次
  const TRENDING_URL =
    "https://api.themoviedb.org/3/trending/movie/day?api_key=e86818f56e7d92f357708ecb03052800";
  // 取得類別 id 與對應的名稱
  const GENRES_URL =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e86818f56e7d92f357708ecb03052800";
  // 類別資料
  const [genresData, setGenresData] = useState([]);
  // 類別顯示的最大數量，除非滾到底，否則先不顯示
  const [showAmount, setShowAmount] = useState(5);

  useEffect(() => {
    getData(TRENDING_URL, setPopularMovies);
    getData(GENRES_URL, setGenresData);

    window.addEventListener("scroll", scrollHandler);
  }, []);

  function scrollHandler() {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >=
        document.documentElement.scrollHeight &&
      showAmount < MovieSwiperElements.length
    ) {
      setShowAmount((prev) => prev + 3);
    }
  }

  const carouselElements = popularMovies.results
    ? popularMovies.results.map((movie) => {
        return (
          <Link
            to={`/movie/${movie && movie.id}`}
            className="carousel"
            key={movie && movie.id}>
            <div className="carousel__img">
              <img
                src={`https://image.tmdb.org/t/p/original/${
                  movie && movie.backdrop_path
                }`}
                className="carousel__backdrop"
                alt="movie-backdrop"
              />
              <img
                src={`https://image.tmdb.org/t/p/original/${
                  movie && movie.poster_path
                }`}
                className="carousel__poster"
                alt="movie-poster"
              />
            </div>
            <div className="carousel__text">
              <h2 className="carousel__title">
                {movie && movie.original_title}
              </h2>
              <div className="carousel__info">
                <p className="carousel__release-date">
                  {movie && movie.release_date}
                </p>
                <p className="carousel__vote">
                  {movie && movie.vote_average}
                  <i className="fa-solid fa-star"></i>
                </p>
              </div>
              <p className="carousel__overview">{movie && movie.overview}</p>
            </div>
          </Link>
        );
      })
    : "";

  const MovieSwiperElements = genresData.genres
    ? genresData.genres.map((genres, index) => {
        return (
          <MovieSwiper key={genres.id} {...genres} show={index < showAmount} />
        );
      })
    : "loading...";

  return (
    <section className="home">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        transitionTime={3}
        infiniteLoop={true}
        showStatus={false}>
        {carouselElements}
      </Carousel>
      <div className="genres">
        <div className="container">{MovieSwiperElements}</div>
      </div>
    </section>
  );
};

export default Home;
