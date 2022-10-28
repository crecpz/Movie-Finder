import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const API_URL =
    "https://api.themoviedb.org/3/movie/popular?api_key=e86818f56e7d92f357708ecb03052800";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMovies(data.results));
  }, []);

  const carouselElements = movies.map(
    ({
      id,
      original_title,
      overview,
      release_date,
      vote_average,
      poster_path,
      backdrop_path,
    }) => {
      return (
        <Link to={`/movie/${id}`} className="carousel">
          <div className="carousel__img">
            <img
              src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
              alt="movie-backdrop"
            />
          </div>
          <div className="carousel__text">
            <h2 className="carousel__title">{original_title}</h2>
            <div className="carousel__info">
              <p className="carousel__release-date">{release_date}</p>
              <p className="carousel__vote">
                {vote_average}
                <i class="fa-solid fa-star"></i>
              </p>
            </div>
            <p className="carousel__overview">{overview}</p>
          </div>
        </Link>
      );
    }
  );

  return (
    <section className="banner">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        transitionTime={3}
        infiniteLoop={true}
        showStatus={false}
        // centerMode={true}
        // centerSlidePercentage={100}
      >
        {carouselElements}
      </Carousel>
    </section>
  );
};

export default Home;
