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
import { Link } from "react-router-dom";

const Genres = () => {
  console.log(genresIconsData);

  // 取得類別 id 與對應的名稱
  const GENRES_URL =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e86818f56e7d92f357708ecb03052800";
  // 類別資料
  const [genresData, setGenresData] = useState([]);
  useEffect(() => {
    getData(GENRES_URL, setGenresData);
  }, []);

  console.log(genresData.genres);

  // getData(GENRES_URL)
  const slideElements = genresData.genres
    ? genresData.genres.map((genres) => {
        return (
          <SwiperSlide>
            <Link className="slide-link">
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
          scrollbar={{
            hide: true,
          }}
          slidesPerView="12"
          freeMode={true}
          modules={[Scrollbar]}
          className="mySwiper">
          {slideElements}
        </Swiper>
      </div>
    </div>
  );
};

export default Genres;
