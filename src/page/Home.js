import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useInView } from "react-intersection-observer";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData } from "../utils/function";
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

  const { ref: loadMore, inView: isIntersecting } = useInView();
  const [showAmount, setShowAmount] = useState(3);
  console.log(genresData.genres);
  useEffect(() => {
    // console.log(showAmount <= genresData.genres.length);
    if (isIntersecting) {
      console.log(isIntersecting);
      setShowAmount((prev) => prev + 4);
      console.log(MovieSwiperElements);
    }
    // if (isIntersecting && showAmount <= genresData.length) {
    //   console.log(isIntersecting);
    //   setShowAmount((prev) => prev + 4);
    //   console.log(MovieSwiperElements)
    // }
  }, [isIntersecting]);

  useEffect(() => {
    getData(TRENDING_URL, setPopularMovies);
    getData(GENRES_URL, setGenresData);
  }, []);

  // * 此為 loader 標誌的樣式
  const override = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  // * 輪播
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
              <h3 className="carousel__title">
                {movie && movie.original_title}
              </h3>
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

  // * genres swiper
  const MovieSwiperElements = genresData.genres
    ? genresData.genres.map((genres, index) => {
        return (
          <MovieSwiper
            key={genres.id}
            id={genres.id}
            {...genres}
            show={index <= showAmount}
          />
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
      <div className="home__genres">
        {MovieSwiperElements}
        {genresData.genres && showAmount <= genresData.genres.length && (
          <div ref={loadMore} className="load-more">
            <PulseLoader color="#fff" cssOverride={override} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
