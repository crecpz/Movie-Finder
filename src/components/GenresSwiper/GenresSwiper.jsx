import { useState, useEffect, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { Scrollbar } from "swiper";
import { NavLink, useParams } from "react-router-dom";
import genresData from "../../utils/genresData";

const GenresSwiper = () => {
  // 存放類別資料(TMDB 提供的 19 個類別)
  const [genres, setGenres] = useState(genresData);
  // 取得 url params
  const { genresId = "28" } = useParams();
  // swiper Ref
  const swiperRef = useRef(null);

  //* 若使用者是從其他頁面點擊 genres tag 的方式連結進此頁，則將對應的 genres icon 滾動到正確的位置
  useEffect(() => {
    // 找出目前 slide 所在的 index
    const currentSlide = genres.findIndex(({ id }) => String(id) === genresId);
    // 使用 swiper 提供的方法，將 slide 移動到指定的位置
    swiperRef.current.swiper.slideTo(currentSlide);
  }, [genres]);

  //* slideElements
  const slideElements = genres.map(({ id, name, icon }) => {
    return (
      <SwiperSlide key={id}>
        <NavLink
          to={id}
          className={({ isActive }) =>
            // 註: genresId === genre.id
            isActive || genresId === id ? "slide-link active" : "slide-link"
          }>
          <i className={`slide-link__icon ${icon}`}></i>
          <span className="slide-link__name">
            {`${name === "Science Fiction" ? "Sci-Fi" : name}`}
          </span>
        </NavLink>
      </SwiperSlide>
    );
  });

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
