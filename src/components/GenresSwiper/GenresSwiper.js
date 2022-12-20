import { useState, useEffect, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { Scrollbar } from "swiper";
import { getData } from "../../utils/function";
import genresIconsData from "../../utils/genresIconsData";
import { NavLink, useParams } from "react-router-dom";

const GenresSwiper = () => {
  // 取得類別 id 與對應的名稱
  const GENRES_URL =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e86818f56e7d92f357708ecb03052800";
  // 存放類別資料(TMDB 提供的 19 個類別)
  const [genresData, setGenresData] = useState([]);
  // 取得 url params
  const { genresId } = useParams();
  // swiper Ref
  const swiperRef = useRef(null);

  useEffect(() => {
    let subscribed = true;
    // 取得類別資料
    if (subscribed) getData(GENRES_URL, setGenresData);
    return () => {
      subscribed = false;
    };
  }, []);

  //* 從其他頁面的 <Link> 連結進此頁後，將 swiper 滾動到正確的位置
  useEffect(() => {
    // 如果目前存在來自 useParams() 所獲得的 genresId，且目前 genresData 內已有資料:
    if (genresId && genresData.genres) {
      // 找出目前 slide 所在的 index
      const currentSlide = genresData.genres.findIndex(({ id }) => {
        return String(id) === genresId;
      });
      // 移動到指定的位置
      swiperRef.current.swiper.slideTo(currentSlide);
    }
  }, [genresData]);

  //* slideElements
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
          ref={swiperRef}
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
