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
  const API_URL =
    "https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&primary_release_date.gte=2022-10&primary_release_date.lte=2022-10-31";
  const [genresData, setGenresData] = useState([
    {
      id: 28,
      name: "Action",
    },
    {
      id: 16,
      name: "Animation",
    },
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 80,
      name: "Crime",
    },
  ]);
  const [genresContent, setGenresContent] = useState([]);

  const GENRES_URL =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e86818f56e7d92f357708ecb03052800";

  const DISCOVER_GENRES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=16`;
  // const DISCOVER_GENRES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${genresId}`;

  useEffect(() => {
    getData(API_URL, setPopularMovies);
    getData(GENRES_URL, setGenresData);

    // getData(DISCOVER_GENRES_URL, setGenresContent);

    if (genresData) {
      genresData.map((i) => {
        fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${i.id}`
        )
          .then((res) => res.json())
          .then((data) =>
            setGenresContent({ name: i.name, result: data.results })
          );
        // .then((data) => console.log({name: i.name, result: data.results}));
      });
    }

    /*
    [
      {
        name: 'action',
        content: [],
      },
      {
        name: 'action',
        content: [],
      },
    ]

    */
  }, []);

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

  // https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=%2028

  const MovieSwiperElements = genresData.genres
    ? genresData.genres.map((genres) => {
        return <MovieSwiper key={genres.id} {...genres} />;
      })
    : "loading...";

  // console.log(MovieSwiperElements)

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
      {MovieSwiperElements}
    </section>
  );
};

export default Home;
