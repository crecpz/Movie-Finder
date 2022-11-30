/**
 * * 獲取單項資料(指的是後續不會需要再獲取更多的資料，ex: 一部電影的詳細資訊)
 * @param {*} url fetch url
 * @param {*} setState 資料儲存的 state
 * @param {*} handleError 錯誤處理 callback
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
 * * 獲取更多的資料(在原來的基礎上獲取更多)
 * @param {*} API_URL url fetch url
 * @param {*} setState setState 資料儲存的 state
 */
export const getMoreData = async (API_URL, setState) => {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Error");
    }

    const data = await res.json();

    setState((prev) => {
      return removeDuplicate(prev, data.results);
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * * 防止獲取到重複的電影(因資料庫內有發現重複的電影)
 * @param {*} originMovies 本來的電影
 * @param {*} inCommingMovies 新獲取的電影
 * @returns 返回去除重複後的結果(Array)
 */
export function removeDuplicate(originMovies, inCommingMovies) {
  return [...originMovies, ...inCommingMovies].reduce((acc, cur) => {
    if (!acc.some((i) => i.id === cur.id)) {
      acc.push(cur);
    }
    return acc;
  }, []);
}

/**
 * * 取得當月首日~當月最後一天的日期
 * @returns
 */
export function getFirstDayAndLastDayOfMonth() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return [firstDayOfMonth, lastDayOfMonth].map((date) =>
    date
      .toLocaleString()
      .split(" ")[0]
      .split("/")
      .map((str) => (Number(str) < 10 ? "0" + str : str))
      .join("-")
  );
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
 * 滾動到指定的 ref 上
 * @param {*} ref 指定的 ref
 */
export function scrollDownTo(ref) {
  window.scrollTo({
    top: ref.current.offsetTop,
    behavior: "smooth",
  });
}
