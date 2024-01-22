const order = ["HTML", "CSS", "JavaScript"];

const sortByFileConvention = (langA: string, langB: string) => {
  const idxA = order.indexOf(langA), idxB = order.indexOf(langB);
  return idxA - idxB;
} 

export default sortByFileConvention;