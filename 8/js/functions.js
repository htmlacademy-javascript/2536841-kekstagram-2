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

const checkTimeRange = (start = '', end = '', meeting = '', duration = 1) => {
  const startTimeValues = start.split(':');
  const endTimeValues = end.split(':');
  const meetingTimeValues = meeting.split(':');

  const startMin = Number(startTimeValues[0]) * 60 + Number(startTimeValues[1]);
  const endMin = Number(endTimeValues[0]) * 60 + Number(endTimeValues[1]);
  const meetingMin = Number(meetingTimeValues[0]) * 60 + duration;

  return meetingMin >= startMin && meetingMin <= endMin;
};

checkTimeRange('08:00', '17:30', '14:00', 90);
