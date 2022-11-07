import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData } from "../utils/function";
import { Link } from "react-router-dom";

const MovieSwiper = ({ id, name: genresName, show }) => {
  const DISCOVER_GENRES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${id}`;
  const [genresContent, setGenresContent] = useState([]);

  useEffect(() => {
    getData(DISCOVER_GENRES_URL, setGenresContent);
  }, []);

  const slideElements = genresContent.results
    ? genresContent.results.map((movie) => {
        return (
          <SwiperSlide key={movie && movie.id}>
            <div className="movie-slide">
              <Link
                to={`/movie/${movie && movie.id}`}
                className="movie-slide__img-link">
                <img
                  src={`https://image.tmdb.org/t/p/original/${
                    movie && movie.backdrop_path
                  }`}
                  className="movie-slide__backdrop"
                  alt="movie-backdrop"
                />
              </Link>
              <Link
                to={`/movie/${movie && movie.id}`}
                className="movie-slide__title-link">
                <h2 className="movie-slide__name">
                  {movie && movie.original_title}
                </h2>
              </Link>
            </div>
          </SwiperSlide>
        );
      })
    : "loading...";

  return show ? (
    <div className="movie-swiper genres__item">
        <h2 className="layout-title">{genresName}</h2>
        <Swiper
          slidesPerView={5}
          spaceBetween={20}
          slidesPerGroup={3}
          loop={true}
          loopFillGroupWithBlank={false}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            576: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1300: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1400: {
              slidesPerView: 5,
              spaceBetween: 20,
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
