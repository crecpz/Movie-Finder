import { NavLink, Outlet } from "react-router-dom";

const Watchlist = () => {

  console.log(1)
  return (
    <div className="watchlist">
      <div className="container">
        <div className="watchlist__header">
          <h2 className="layout-title">Watchlist</h2>
          <div className="watchlist__links">
            <NavLink
              to="/watchlist/unwatched"
              className={({ isActive }) =>
                isActive
                  ? "watchlist__link watchlist__link--active"
                  : "watchlist__link"
              }>
              Unwatched
            </NavLink>
            <NavLink
              to="/watchlist/watched"
              className={({ isActive }) =>
                isActive
                  ? "watchlist__link watchlist__link--active"
                  : "watchlist__link"
              }>
              Watched
            </NavLink>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Watchlist;
