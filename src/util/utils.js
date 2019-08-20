const isNull = obj => {
  if (typeof obj == 'null' || typeof obj == 'undefined' || obj == 'undefined' || obj == 'null' || obj == '') {
    return true;
  }
  return false;
};

const setLocal = (key, v) => {
  window.localStorage.setItem(key, v);
};
const getLocal = key => {
  return key ? window.localStorage.getItem(key) : window.localStorage.getItem();
};

const setObjLocal = obj => {
  if (obj) {
    Object.keys(obj).forEach(key => {
      window.localStorage.setItem(key, obj[key]);
    });
  }
};
// return Boolean ,true (失效)，false(没有失效)
const checkToken = () => {
  let tokenExpires = window.localStorage.getItem('tokenExpires');
  if (isNull(tokenExpires)) {
    return true;
  } else {
    return Number(window.localStorage.getItem('tokenExpires')) < new Date().getTime();
  }
};

const removeLocal = v => {
  if (v) {
    window.localStorage.removeItem(v);
  } else {
    window.localStorage.clear();
  }
};

export default { setLocal, getLocal, setObjLocal, checkToken, removeLocal, isNull };
