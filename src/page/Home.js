import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);

  const API_URL =
    "https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&primary_release_date.gte=2022-10&primary_release_date.lte=2022-10-31";
  // "https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&primary_release_date.gte=2022-10-01&primary_release_date.lte=2022-10-31";

  // const API_URL =
  //   "https://api.themoviedb.org/3/movie/popular?api_key=e86818f56e7d92f357708ecb03052800";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPopularMovies(data.results));
  }, []);

  const carouselElements = popularMovies.map((movie) => {
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
          <h2 className="carousel__title">{movie && movie.original_title}</h2>
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
  });

  return (
    <section className="banner">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        transitionTime={3}
        infiniteLoop={true}
        showStatus={false}>
        {carouselElements}
      </Carousel>
    </section>
  );
};

export default Home;
