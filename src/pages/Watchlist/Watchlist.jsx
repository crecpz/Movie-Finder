import { useEffect,useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { capitalize } from "../../utils/function";
import ScrollToTop from "react-scroll-to-top";

const Watchlist = ({ setUnreadList }) => {
  // 網址參數
  const { currentWatchStatus = "unwatched" } = useParams();
  // 設定 watchlist__status-btn 的閃爍狀態(在使用者改變觀看狀態時，閃爍按鈕)
  const [statusBtnFlashing, setStatusBtnFlashing] = useState(false);
  useEffect(() => {
    // 進入 watchlist 頁面後，將 unreadList 清空
    setUnreadList([]);
  }, []);

  return (
    <section className="watchlist">
      <div className="container">
        <div className="watchlist__header">
          <h2 className="layout-title">Watchlist</h2>
          <div className="watchlist__status-btns">
            {["unwatched", "watched"].map((listType, index) => {
              return (
                <NavLink
                  key={index}
                  to={`/watchlist/${listType}`}
                  className={({ isActive }) => {
                    if (isActive || listType === currentWatchStatus) {
                      return "watchlist__status-btn active";
                    } else {
                      // 根據 statusBtnFlashing 來控制按鈕閃爍(註:按鈕閃爍只會發生在非 active 的按鈕上)
                      if (statusBtnFlashing) {
                        return "watchlist__status-btn flashing-animation";
                      } else {
                        return "watchlist__status-btn";
                      }
                    }
                  }}>
                  {capitalize(listType)}
                </NavLink>
              );
            })}
          </div>
        </div>

        <Outlet context={[statusBtnFlashing, setStatusBtnFlashing]} />
      </div>
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
    </section>
  );
};

export default Watchlist;
