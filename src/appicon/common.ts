const mergeArray = (arr1: Array<any>, arr2: Array<any>) => {
  const merged = [...arr1, ...arr2];
  return merged.filter((item, pos) => merged.indexOf(item) === pos);
};
export { mergeArray };
