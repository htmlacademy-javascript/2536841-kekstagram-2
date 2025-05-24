import {getRandomNumber, getRandomValue} from './utils.js';
import {getPostsData} from './data.js';

const {DESCRIPTIONS, MESSAGES, NAMES} = getPostsData();
const Likes = {
  MIN: 15,
  MAX: 200,
};
const Comments = {
  MIN: 0,
  MAX: 30,
};

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
    comments: Array.from({length: getRandomNumber(Comments.MIN, Comments.MAX)}, (_, id) => createComment(id)),
  }
);

const posts = (count) => Array.from({length: count}, (_, index) => createPost(index));

export {posts};
