import { Link } from "react-router-dom";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const MovieSwiper = ({ movies, swiperBreakpoints }) => {
  //* slideElements
  const slideElements = movies.results
    ? movies.results.map((movie) => {
        return movie.backdrop_path && movie.title ? (
          <SwiperSlide key={movie.id} className="movie-slide">
            <Link to={`/movie/${movie.id}`} className="movie-slide__img-link">
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                className="movie-slide__img movie-slide__img--backdrop"
                alt="movie-backdrop"
              />
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                className="movie-slide__img movie-slide__img--poster"
                alt="movie-poster"
              />
              <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
            </Link>
            <Link to={`/movie/${movie.id}`} className="movie-slide__title-link">
              <h2 className="movie-slide__title">{movie.title}</h2>
            </Link>
          </SwiperSlide>
        ) : (
          ""
        );
      })
    : "loading...";

  return (
    <Swiper
      modules={[Navigation, Pagination, FreeMode]}
      slidesPerView={6}
      slidesPerGroup={6}
      spaceBetween={15}
      navigation={true}
      loop={true}
      freeMode={true}
      simulateTouch={true}
      pagination={{
        type: "bullets",
      }}
      breakpoints={swiperBreakpoints}
      className="movie-swiper">
      {slideElements}
    </Swiper>
  );
};

export default MovieSwiper;
