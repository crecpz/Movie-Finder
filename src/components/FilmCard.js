// import convert from "chinese_convert"; 先不要山

const FilmCard = ({
  id,
  title,
  overview,
  poster_path,
  original_name,
  original_title,
  backdrop_path,
}) => {
  const API_IMG = "https://image.tmdb.org/t/p/w500/";
  console.log(original_title)

  return overview && original_title ? (
    <div className="movie-card">
      <img className="movie-card__img" src={API_IMG + poster_path} />
      <img className="movie-card__img" src={API_IMG + backdrop_path} />
      {/* <img className="movie-card__img" src={API_IMG + poster_path} /> */}
      <p className="movie-card__title">{title}</p>
      <p className="movie-card__overview">{overview}</p>
    </div>
  ) : "";
};

export default FilmCard;
