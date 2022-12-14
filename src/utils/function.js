/**
 * * 獲取單項資料(後續不會需要再獲取更多的資料，ex: 一部電影的詳細資訊)
 * @param {*} `url` fetch url
 * @param {*} `setState` 資料儲存的 state
 * @param {*} `handleError` 錯誤處理 callback
 */
export const getData = async (url, setState, handleError) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Error");
    }
    const data = await res.json();
    setState(data);
  } catch (err) {
    console.log(err);
    if (handleError) handleError();
  }
};

/**
 * * 取得更多的資料加入原來的 state 當中，並在過程中去除重複的資料(如果有重複)
 * @param {*} `url` fetch url
 * @param {*} `setState` 資料儲存的 state
 */
export const getMoreData = async (API_URL, setState) => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("Error");
    }
    const data = await res.json();
    setState((prev) => {
      return {
        ...prev,
        results: removeDuplicate([...prev.results, ...data.results], "id"),
      };
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * * 更新 watchlist 資料與 unreadList 資料
 * @param {*} `id` 當前電影 id
 * @param {*} `inWatchlist` 用來判斷是否存在於 watchlist state 中
 * @param {*} `setWatchlist` 用來更新 watchlist state
 * @param {*} `setUnreadList` 用來更新 unreadList state
 */
export function changeWatchlist(id, inWatchlist, setWatchlist, setUnreadList) {
  // 如果 id 已經存在於 watchlist 當中
  if (inWatchlist) {
    // 從 watchlist 中移除該項電影
    setWatchlist((prev) => {
      return prev.filter((movie) => movie.id !== id);
    });
    // 從 unreadList 刪除當前電影
    setUnreadList((prev) => {
      return prev.filter((i) => i !== id);
    });
  } else {
    // 如果 id 不存在於目前 watchlist 當中
    // 新增新的電影資料至 watchlist
    setWatchlist((prev) => {
      return [...prev, { id: id, status: "unwatched" }];
    });
    // 從 unreadList 加入當前電影
    setUnreadList((prev) => {
      return [...prev, id];
    });
  }
}

/**
 * * 防止在取得的資料中出現重複項目，若有重複項目，保留舊項目
 * @param {*} `arr` 獲取到的資料陣列
 * @param {*} `key` 根據 key 對應的 value 來檢查是否重複
 * @returns 返回去除重複後的結果(Array)
 */
export function removeDuplicate(arr, key) {
  return arr.reduce((acc, cur) => {
    if (acc.every((item) => item[key] !== cur[key])) {
      acc.push(cur);
    }
    return acc;
  }, []);
}

/**
 * * 取得當月首日~當月最後一天的日期
 * @returns 返回一個有 firstDate, lastDate key 的物件
 */
export function getFirstDayLastDay() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const format = (dateObj) => {
    return dateObj
      .toLocaleString()
      .split(" ")[0]
      .split("/")
      .map((str) => (Number(str) < 10 ? "0" + str : str))
      .join("-");
  };
  return {
    firstDate: format(firstDay),
    lastDate: format(lastDay),
  };
}

/**\
 * * 移除帶有括號的 string
 */
export function removeBracketsStr(str) {
  const reg = /\(\w+\s*\w+\)/gi;
  return reg.test(str) ? str.replace(reg, "") : str;
}

/**
 * * 將分鐘成轉換時間格式
 * @param {*} min 分鐘
 * @returns 返回一個 X h X min 字串
 */
export function convertTime(min) {
  let h = Math.floor(min / 60);
  let m = min % 60;
  return `${h <= 0 ? "" : h + " h "}${m <= 0 ? "" : m + " min"}`;
}

//* 將字母首字變大寫
export function capitalize(str) {
  return str
    .split("-")
    .map((str) => str[0].toUpperCase() + str.substring(1))
    .join(" ");
}

//* 無圖片替代方案
export function noAvatar({ currentTarget }) {
  currentTarget.onerror = null; // prevents looping
  currentTarget.src =
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
}
export function noPoster({ currentTarget }) {
  currentTarget.onerror = null; // prevents looping
  currentTarget.src =
    "https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80&w=440";
}
export function noBackdrop({ currentTarget }) {
  currentTarget.onerror = null; // prevents looping
  currentTarget.src =
    "https://cdn.pixabay.com/photo/2019/11/07/20/48/cinema-4609877_960_720.jpg";
}

/**
 ** 滾動到指定的 ref 上
 * @param {*} `ref` 指定的 ref
 */
export function scrollDownTo(ref) {
  window.scrollTo({
    top: ref.current.offsetTop,
    behavior: "smooth",
  });
}
