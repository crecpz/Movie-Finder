// export function getData(url, setState) {
// fetch(url)
//   .then((res) => res.json())
//   .then((data) => setState(data));
// }

export const getData = async (url, setState) => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Error");
    }

    const data = await res.json();
    return setState(data);
  } catch (err) {
    console.error(err);
  }
};

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

export function noImage({ currentTarget }) {
  currentTarget.onerror = null; // prevents looping
  currentTarget.src =
    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    
  // * 原版
  // onError={({ currentTarget }) => {
  //   currentTarget.onerror = null; // prevents looping
  //   currentTarget.src =
  //     "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  // }}
}
