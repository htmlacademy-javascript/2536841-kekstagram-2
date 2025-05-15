const compareLength = (string = '', length = 1) => string.length <= length;

compareLength('проверяемая строка', 20);

const checkPalindrome = (string = '') => {
  const normalizeString = string.replaceAll(' ', '').toLowerCase();
  return normalizeString === [...normalizeString].reverse().join('');
};

checkPalindrome('Лёша на полке клопа нашёл ');

const getNumber = (line = '') => {
  line += '';
  return parseInt(line.replace(/\D+/g, ''), 10);
};

getNumber(2023);
