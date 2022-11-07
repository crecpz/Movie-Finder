import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { FreeMode, Navigation, Pagination, Scrollbar } from "swiper";
import { getData } from "../utils/function";
import genresIconsData from "../utils/genresIconsData";
import { Link, useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import MovieCards from "../components/MovieCards";

const Genres = () => {
  // const { genresId } = useParams();

  // 取得類別 id 與對應的名稱
  const GENRES_URL =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e86818f56e7d92f357708ecb03052800";
  // 類別資料
  const [genresData, setGenresData] = useState([]);
  useEffect(() => {
    getData(GENRES_URL, setGenresData);
  }, []);

  // getData(GENRES_URL)
  const slideElements = genresData.genres
    ? genresData.genres.map((genres) => {
        return (
          <SwiperSlide>
            <Link to={`${genres ? genres.id : ""}`} className="slide-link">
              <i
                className={`slide-link__icon ${
                  genresIconsData[genres.id]
                }`}></i>
              <span className="slide-link__name">{`${
                genres.name === "Science Fiction" ? "Sci-Fi" : genres.name
              }`}</span>
            </Link>
          </SwiperSlide>
        );
      })
    : "";
  return (
    <div className="genres">
      <div className="container">
        <Swiper
          className="mySwiper"
          scrollbar={{
            hide: true,
          }}
          navigation={true}
          slidesPerView={3}
          freeMode={false}
          modules={[Scrollbar, Navigation]}
          breakpoints={{
            0: {
              slidesPerView: 4,
              spaceBetween: 0,
            },
            576: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 8,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 10,
              spaceBetween: 10,
            },
            1300: {
              slidesPerView: 12,
              spaceBetween: 10,
            },
            1400: {
              slidesPerView: 14,
              spaceBetween: 10,
            },
          }}>
          {slideElements}
        </Swiper>
        {/* <MovieCards /> */}
      </div>
    </div>
  );
};

export default Genres;
