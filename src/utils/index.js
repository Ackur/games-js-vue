export const getRandomColor = () => {
  const [r, g, b] = new Array(3)
    .fill()
    .map(() => Math.floor(Math.random() * 255));
  return { r, g, b, style: `rgb(${r}, ${g}, ${b})` };
};
