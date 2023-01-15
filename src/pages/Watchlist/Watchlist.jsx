import { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { capitalize } from "../../utils/function";
import ScrollToTop from "react-scroll-to-top";

const Watchlist = ({ setUnreadList }) => {
  // 網址參數
  const { currentWatchStatus = "unwatched" } = useParams();
  // 設定 watchlist__status-btn 的閃爍狀態，此 state 將會利用 <Outlet /> context 傳給 watchcard，
  // 當使用者改變 watchcard 的觀看狀態時設為 true，接著透過 onAnimationEnd 設為 false。
  const [statusBtnFlashing, setStatusBtnFlashing] = useState(false);
  // 存放 statusBtn 的 DOM 元素(將 "Unwatched" & "Watched" 按鈕，以 Array 的方式存放在 statusBtnRefs 中)
  const statusBtnRefs = useRef([]);

  // 進入 watchlist 頁面後，將 unreadList 清空
  useEffect(() => {
    setUnreadList([]);
  }, []);

  useEffect(() => {
    let animationId;
    // 當 statusBtnFlashing 為 true
    if (statusBtnFlashing) {
      // 根據目前所在的頁面位置，閃爍另一個按鈕
      if (currentWatchStatus === "unwatched") {
        // 假設目前位於 "Unwatched"
        activeFlashingAnimationOnIndex(1); // 在 "Watched" 套用動畫
      } else {
        // 假設目前位於 "Watched"
        activeFlashingAnimationOnIndex(0); // 在 "Unwatched" 套用動畫
      }
    }
    /**
     * 套用閃爍動畫到按鈕上
     * @param {*} idx 按鈕在 statusBtnRefs.current 的 index
     */
    function activeFlashingAnimationOnIndex(idx) {
      // 移除現有的 class
      statusBtnRefs.current[idx].classList.remove("flashing-animation");
      // 利用 requestAnimationFrame 使其變成非同步，並新增 class
      animationId = window.requestAnimationFrame(() => {
        // 新增 class 到指定的元素上面
        statusBtnRefs.current[idx].classList.add("flashing-animation");
      });
    }
    return () => cancelAnimationFrame(animationId);
  }, [statusBtnFlashing]);

  /**
   * * 移除當前按鈕的 `flashing-animation` class，並將 statusBtnFlashing 恢復成 false
   * 此函式呼叫的時間點：
   *  1.使用者直接點擊任一個 `watchlist__status-btn` 之後。
   *  2.閃爍動畫結束之後(onAnimationEnd)。
   * @param {*} index 按鈕在 statusBtnRefs 中的 index
   */
  function cancelFlashingAnimation(index) {
    setStatusBtnFlashing(false);
    statusBtnRefs.current[index].classList.remove("flashing-animation");
  }

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
                  ref={(el) => (statusBtnRefs.current[index] = el)}
                  className={({ isActive }) =>
                    isActive || listType === currentWatchStatus
                      ? "watchlist__status-btn active"
                      : "watchlist__status-btn"
                  }
                  onAnimationEnd={() => {
                    cancelFlashingAnimation(index);
                  }}
                  onClick={() => {
                    cancelFlashingAnimation(index);
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
