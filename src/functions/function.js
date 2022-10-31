// export function getData(url, setState) {
  // fetch(url)
  //   .then((res) => res.json())
  //   .then((data) => setState(data));
// }


export const getData = async (url, setState) => {
  try {
    const res = await fetch(url);
    
    if(!res.ok){
      throw new Error('Error')
    }

    const data = await res.json();
    return setState(data);

  } catch(err){
    console.error(err);
  }
}