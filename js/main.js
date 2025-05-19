const POST_COUNT = 25;
const DESCRIPTIONS = ['Вся красота мира в одной картинке', 'Моменты, которые запечатлены навсегда', 'История, рассказанная через объектив', 'Остановить время в одном кадре', 'Зарядитесь нашим теплом'];
const MESSAGES = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
const NAMES = ['Ирина', 'Артём', 'Виктор', 'Василий', 'Анастасия', 'Марк', 'Ольга', 'Ваня', 'Фёдор', 'Вика', 'Ника', 'Лена', 'Саша', 'София', 'Никита', 'Павел'];
const Likes = {
  MIN: 15,
  MAX: 200,
};

const getRandomNumber = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomValue = (array = []) => array[getRandomNumber(0, array.length - 1)];
const getCommentMessage = () => {
  const messagesList = [];
  while (messagesList.length < getRandomNumber(1, 2)) {
    messagesList.push(getRandomValue(MESSAGES));
  }
  return messagesList;
};

const createComment = (index) => (
  {
    id: index,
    avatar: `img/avatar-${ getRandomNumber(1, 6) }.svg`,
    message: getCommentMessage(),
    name: getRandomValue(NAMES),
  }
);

const createPost = (index) => (
  {
    id: index + 1,
    url: `photos/${ index + 1 }.jpg`,
    description: getRandomValue(DESCRIPTIONS),
    likes: getRandomNumber(Likes.MIN, Likes.MAX),
    comments: Array.from({length: getRandomNumber(0, 30)}, (_, id) => createComment(id)),
  }
);

Array.from({length: POST_COUNT}, (_, index) => createPost(index));
