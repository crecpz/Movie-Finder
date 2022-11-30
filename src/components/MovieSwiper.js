import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
// import "swiper/css/lazy";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData } from "../utils/function";
import { Link } from "react-router-dom";

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
                  className="movie-slide__backdrop"
                  alt="movie-backdrop"
                />
                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
              </Link>
              <Link
                to={`/movie/${movie && movie.id}`}
                className="movie-slide__title-link">
                <h2 className="movie-slide__name">{movie.original_title}</h2>
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
        modules={[Navigation, Pagination]}
        slidesPerView={6}
        slidesPerGroup={6}
        spaceBetween={20}
        navigation
        loop={true}
        pagination={{
          type: "bullets",
        }}
        breakpoints={{
          // 0: {
          //   slidesPerView: 1,
          //   slidesPerGroup: 1,
          //   spaceBetween: 0,
          // },
          // 576: {
          //   slidesPerView: 2,
          //   slidesPerGroup: 2,
          // },
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          576: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          1024: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          1300: {
            slidesPerView: 5,
            slidesPerGroup: 5,
          },
          1400: {
            slidesPerView: 6,
            slidesPerGroup: 6,
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
