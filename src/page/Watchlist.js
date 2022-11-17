import { NavLink, Outlet, useParams } from "react-router-dom";
import { capitalize } from "../utils/function";

import ScrollToTop from "react-scroll-to-top";

const Watchlist = ({ watchlist }) => {
  const { watchStatus = "unwatched" } = useParams();

  return (
    <div className="watchlist">
      <div className="container">
        <div className="watchlist__header">
          <h2 className="layout-title">Watchlist</h2>
          <div className="watchlist__links">
            {["unwatched", "watched"].map((listType) => {
              return (
                <NavLink
                  to={`/watchlist/${listType}`}
                  className={({ isActive }) =>
                    isActive || listType === watchStatus
                      ? "watchlist__link active"
                      : "watchlist__link"
                  }>
                  {capitalize(listType)}
                </NavLink>
              );
            })}

            {/* ! 以下原版 */}

            {/* <NavLink
              to="/watchlist/unwatched"
              className={({ isActive }) =>
                isActive || watchStatus === undefined
                  ? "watchlist__link active"
                  : "watchlist__link"
              }>
              Unwatched
            </NavLink>

            <NavLink
              to="/watchlist/watched"
              className={({ isActive }) =>
                isActive ? "watchlist__link active" : "watchlist__link"
              }>
              Watched
            </NavLink> */}
          </div>
        </div>

        <Outlet />
      </div>
      <ScrollToTop
        smooth
        className="scroll-to-top"
        color="#fff"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </div>
  );
};

export default Watchlist;
