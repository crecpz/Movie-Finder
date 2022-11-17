// // @ 在下面原版的基礎上做點小改， 原本 return setState(data); -----> 變成 return setState(data.results)
// export const getData = async (url, setState) => {
//   try {
//     const res = await fetch(url);
//     if (!res.ok) {
//       throw new Error("Error");
//     }
//     const data = await res.json();
//     return setState(data.results);
//   } catch (err) {
//     console.log(err);
//   }
// };

/**
 * 獲取單項資料(指的是後續不會需要再獲取更多的資料，ex: 一部電影的詳細資訊)
 * @param {*} url fetch url
 * @param {*} setState 資料儲存的 state
 */
export const getData = async (url, setState) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Error");
    }
    const data = await res.json();
    setState(data);
  } catch (err) {
    console.log(err);
  }
};

/**
 * 獲取更多的資料(在原來的基礎上獲取更多)
 * ! 注意:
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
 * 取得當月首日~當月最後一天的日期
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

// 將字母首字變大寫
export function capitalize(str) {
  return str
    .split("-")
    .map((str) => str[0].toUpperCase() + str.substring(1))
    .join(" ");
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
