import { NavLink, Outlet, useParams } from "react-router-dom";
import { capitalize } from "../utils/function";

const Watchlist = ({ watchlist }) => {
  const { watchStatus = "unwatched" } = useParams();

  console.log(watchStatus);

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
    </div>
  );
};

export default Watchlist;
