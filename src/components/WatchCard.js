import { Link } from "react-router-dom";

const WatchCard = () => {

  return (
    <div className="watchcard">
      <img className="watchcard__movie-backdrop" src="	https://image.tmdb.org/t/p/original//yOg3dhozpoWzoNYA6fAfOIvEr3G.jpg" alt="" />
      <div className="watchcard__content">
        <button className="btn btn-transparent watchcard__btn">Watched</button>
        <button className="btn btn-transparent watchcard__btn">Remove</button>
        <button className="btn btn-transparent watchcard__btn">Fakebtn</button>
        {/* <Link to={`/movie/${movie && movie.id}`} className="btn">More Details</Link> */}
      </div>
    </div>
  );
};

export default WatchCard;
