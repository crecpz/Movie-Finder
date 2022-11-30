import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode, Scrollbar } from "swiper";
import { getData } from "../utils/function";
import { Link } from "react-router-dom";
// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const MovieSwiper = ({ id, name, show }) => {
  const DISCOVER_GENRES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${id}`;
  const [genresContent, setGenresContent] = useState([]);

  useEffect(() => {
    let subscribed = true;
    if (subscribed) getData(DISCOVER_GENRES_URL, setGenresContent);
    return () => {
      subscribed = false;
    };
  }, []);

  //* swiper 內的 slide
  const slideElements = genresContent.results
    ? genresContent.results.map((movie) => {
        return movie.backdrop_path ? (
          <SwiperSlide key={movie.id}>
            <div className="movie-slide">
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
            </div>
          </SwiperSlide>
        ) : (
          ""
        );
      })
    : "loading...";

  return show ? (
    <div className="movie-swiper home__genres-item">
      <Link to={`movies/genres/${id}`} className="home__genres-link">
        <h2 className="layout-title">{name}</h2>
        <i className="fa-solid fa-angle-right"></i>
      </Link>
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
            // slidesPerView: 3,
            slidesPerView: 3.5,
            // slidesPerGroup: 3,
            loop: false,
          },
          768: {
            slidesPerView: 3,
            // slidesPerView: 'auto',
            // slidesPerGroup: 3,
            // width: 100,
          },
          
          1024: {
            slidesPerView:3,
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
        }}>
        {slideElements}
      </Swiper>
    </div>
  ) : (
    ""
  );
};

export default MovieSwiper;
