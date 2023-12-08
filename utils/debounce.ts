const debounce = (fn: Function, delay: number) => {
  let timer: any = null;
  return (...args: any[]) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export default debounce;
