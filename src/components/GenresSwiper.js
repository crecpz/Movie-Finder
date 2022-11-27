import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { Scrollbar } from "swiper";
import { getData } from "../utils/function";
import genresIconsData from "../utils/genresIconsData";
import { NavLink, useParams } from "react-router-dom";

const GenresSwiper = () => {
  // 取得類別 id 與對應的名稱
  const GENRES_URL =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e86818f56e7d92f357708ecb03052800";
  // 存放類別資料(TMDB 提供的 19 個類別)
  const [genresData, setGenresData] = useState([]);
  // 取得 url params
  const { genresId } = useParams();

  useEffect(() => {
    let subscribed = true;
    if (subscribed) getData(GENRES_URL, setGenresData);
    return () => {
      subscribed = false;
    };
  }, []);

  const slideElements = genresData.genres
    ? genresData.genres.map((genres) => {
        return (
          <SwiperSlide key={genres.id}>
            <NavLink
              to={`${genres ? genres.id : ""}`}
              className={({ isActive }) =>
                isActive || (genresId === undefined && genres.id === 28)
                  ? "slide-link active"
                  : "slide-link"
              }>
              <i
                className={`slide-link__icon ${
                  genresIconsData[genres.id]
                }`}></i>
              <span className="slide-link__name">{`${
                genres.name === "Science Fiction" ? "Sci-Fi" : genres.name
              }`}</span>
            </NavLink>
          </SwiperSlide>
        );
      })
    : "";

  return (
    <div className="genres-swiper">
      <div className="container">
        <Swiper
          className="mySwiper"
          modules={[Scrollbar]}
          slidesPerView={3}
          slidesPerGroup={3}
          scrollbar
          breakpoints={{
            0: {
              slidesPerView: 4,
              spaceBetween: 0,
            },
            576: {
              slidesPerView: 5,
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
      </div>
    </div>
  );
};

export default GenresSwiper;
