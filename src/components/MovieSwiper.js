import { Link } from "react-router-dom";

// Swiper 
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const MovieSwiper = ({movies}) => {
  
  //* slide
  const slideElements = movies.results
    ? movies.results.map((movie) => {
        return movie.backdrop_path && movie.original_title ? (
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
            <Link
              to={`/movie/${movie && movie.id}`}
              className="movie-slide__title-link">
              <h2 className="movie-slide__title">{movie.original_title}</h2>
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
      breakpoints={{
        0: {
          slidesPerView: 2.5,
          slidesPerGroup: 2,
          loop: false,
        },
        576: {
          slidesPerView: 3.5,
          loop: false,
        },
        768: {
          slidesPerView: 3,
        },

        1024: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        1300: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        1400: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
      }}
      className="movie-swiper">
      {slideElements}
    </Swiper>
  );
};

export default MovieSwiper;
