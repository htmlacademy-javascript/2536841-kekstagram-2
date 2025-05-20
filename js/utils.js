const getRandomNumber = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomValue = (array = []) => array[getRandomNumber(0, array.length - 1)];

export {getRandomNumber, getRandomValue};
