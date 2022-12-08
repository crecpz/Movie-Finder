import { NavLink, Outlet, useParams } from "react-router-dom";
import { capitalize } from "../utils/function";
import ScrollToTop from "react-scroll-to-top";
import { useEffect } from "react";

const Watchlist = ({ setWatchlist }) => {
  const { watchStatusTag = "unwatched" } = useParams();

  useEffect(() => {
    setWatchlist((prev) => {
      return prev.map((moive) => {
        return { ...moive, unread: false };
      });
    });
  }, []);

  return (
    <section className="watchlist">
      <div className="container">
        <div className="watchlist__header">
          <h2 className="layout-title">Watchlist</h2>
          <div className="watchlist__links">
            {["unwatched", "watched"].map((listType, index) => {
              return (
                <NavLink
                  key={index}
                  to={`/watchlist/${listType}`}
                  className={({ isActive }) =>
                    isActive || listType === watchStatusTag
                      ? "watchlist__link active"
                      : "watchlist__link"
                  }>
                  {capitalize(listType)}
                </NavLink>
              );
            })}
          </div>
        </div>
        <Outlet />
      </div>

      <ScrollToTop
        smooth
        className="scroll-to-top"
        color="#000"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </section>
  );
};

export default Watchlist;
