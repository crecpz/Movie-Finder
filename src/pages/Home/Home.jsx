import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import { getData } from "../../utils/function";
import HomeGenresSwiper from "../../components/HomeGenresSwiper/HomeGenresSwiper";
// Import Swiper
import { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { spinnerStyle } from "../../utils/components-styles";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Home = () => {
  // 趨勢 API_URL (取得每日流行趨勢電影, 24hr 更新一次)
  const TRENDING_URL =
    "https://api.themoviedb.org/3/trending/movie/day?api_key=e86818f56e7d92f357708ecb03052800";
  // 存放每日流行趨勢電影
  const [trendingMovies, setTrendingMovies] = useState([]);
  // 電影類別 API_URL (取得所有類別的 id 與對應的名稱)
  const GENRES_URL =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=e86818f56e7d92f357708ecb03052800";
  // 存放電影類別資料
  const [genresData, setGenresData] = useState([]);
  // 用來偵測 loadMore ref 是否已經進入 intersection observer
  const { ref: loadMore, inView: isIntersecting } = useInView();
  // 用來存放目前在 Home.js 中要顯示的 swiper 數量
  const [showSwiperAmount, setShowSwiperAmount] = useState(3);
  // 儲存首張輪播圖的載入狀態(若載入完畢，將其設為 true 並解除 spinner )
  const [imgIsLoaded, setImgIsLoaded] = useState(false);

  //* 若 loadMore ref 已經進入 intersection observer，增加 genres swiper 顯示的數量
  useEffect(() => {
    if (isIntersecting) {
      setShowSwiperAmount((prev) => prev + 4);
    }
  }, [isIntersecting]);

  useEffect(() => {
    let subscribed = true;
    if (subscribed) {
      // 取得每日流行趨勢電影
      getData(TRENDING_URL, setTrendingMovies);
      // 取得電影類別資料
      getData(GENRES_URL, setGenresData);
    }
    // cleanup function
    return () => {
      subscribed = false;
    };
  }, []);

  //* 處理 img 讀取完成的事件
  function handleImgLoaded() {
    // 變更狀態為 true (表示已經讀取好)
    setImgIsLoaded(true);
  }

  //* hero 輪播(播放每日流行趨勢電影)
  const heroSlideElements = trendingMovies.results
    ? trendingMovies.results.map((movie, index) => {
        return (
          <SwiperSlide key={movie.id}>
            <Link to={`/movie/${movie.id}`} className="hero__slide-link">
              {/* hero__slide 圖片部分 */}
              <div className="hero__slide-imgs">
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  className="hero__slide-img hero__slide-img--backdrop"
                  alt="movie-backdrop"
                  onLoad={() => {
                    // 如果 onLoad 觸發的對象 index === 0 ，代表第一張電影圖已被載入
                    // 調用 handleImgLoaded() 將 imgIsLoaded state 設為 true，下方 poster 也是一樣的方式
                    index === 0 && handleImgLoaded();
                  }}
                />
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  className="hero__slide-img hero__slide-img--poster"
                  alt="movie-poster"
                  onLoad={() => {
                    // 同上(.hero__slide-img--backdrop)方式
                    index === 0 && handleImgLoaded();
                  }}
                />
              </div>
              {/* hero__slide 文字部分 */}
              <div className="hero__slide-text">
                {/* 電影標題 */}
                <h3 className="hero__slide-title">
                  {movie.title ? movie.title : ""}
                </h3>
                {/* 電影資訊 */}
                <div className="hero__slide-info info">
                  {/* 上映日期 */}
                  {movie.release_date ? (
                    <p className="hero__slide-release-date">
                      <i className="fa-regular fa-calendar"></i>
                      {movie.release_date}
                    </p>
                  ) : (
                    ""
                  )}
                  {/* 評分 */}
                  {movie.vote_average ? (
                    <p className="hero__slide-vote">
                      <i className="fa-solid fa-star"></i>
                      {movie.vote_average}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                {/* 文字介紹 */}
                {movie.overview ? (
                  <p className="overview hero__slide-overview">
                    {movie.overview}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </Link>
          </SwiperSlide>
        );
      })
    : "";

  //* genres swiper
  // 遍歷 genres 清單(包含類別名稱、類別 id)
  const HomeGenresSwiperElements =
    genresData.genres &&
    genresData.genres.map((genres, index) => {
      return (
        <HomeGenresSwiper
          key={genres.id}
          id={genres.id}
          {...genres}
          show={index <= showSwiperAmount}
        />
      );
    });

  return (
    <div className="home">
      <div className={`spinner-full-screen${imgIsLoaded ? "" : " active"}`}>
        <PulseLoader color="#fff" cssOverride={spinnerStyle} />
      </div>
      {/* hero section */}
      <section className="hero">
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination]}
          className="hero__swiper">
          {heroSlideElements}
        </Swiper>
      </section>

      <ul className="home__genres-list">
        {HomeGenresSwiperElements}
        {genresData.genres && showSwiperAmount <= genresData.genres.length && (
          <div ref={loadMore} className="spinner">
            <PulseLoader color="#fff" cssOverride={spinnerStyle} />
          </div>
        )}
      </ul>

      {/* ScrollToTop */}
      <ScrollToTop
        smooth
        className="scroll-to-top"
        width="20"
        height="20"
        color="#000"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </div>
  );
};

export default Home;
