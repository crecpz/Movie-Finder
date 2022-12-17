import { useEffect, useState } from "react";
import { getData } from "../../utils/function";
import { Link } from "react-router-dom";
import MovieSwiper from "../MovieSwiper/MovieSwiper";

const HomeGenresSwiper = ({ id, name, show }) => {
  // 獲取特定類別的電影資料，並且以受歡迎程度(popularity)進行排序
  const DISCOVER_GENRES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${id}`;
  // 存放特定類別的電影資料
  const [genresContent, setGenresContent] = useState([]);

  useEffect(() => {
    let subscribed = true;
    if (subscribed) getData(DISCOVER_GENRES_URL, setGenresContent);
    return () => {
      subscribed = false;
    };
  }, []);

  return show ? (
    <li className="home__genres-item">
      <Link to={`movies/genres/${id}`} className="home__genres-link">
        <h2 className="layout-title">{name}</h2>
        <i className="fa-solid fa-angle-right"></i>
      </Link>
      <MovieSwiper
        movies={genresContent}
        swiperBreakpoints={{
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
        }}
      />
    </li>
  ) : (
    ""
  );
};

export default HomeGenresSwiper;
