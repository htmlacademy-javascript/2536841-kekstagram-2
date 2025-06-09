import {showDataError} from './utils.js';

const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';
const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};
const Method = {
  GET: 'GET',
  POST: 'POST',
};
const Type = {
  JSON: 'application/json',
  FORM: 'multipart/form-data',
};

const load = (route, method = Method.GET, type = Type.JSON, body = null) => fetch(`${BASE_URL}${route}`, {method, ContentType: type, body})
  .then((response) => {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  });


const getData = () => load(Route.GET_DATA).catch(() => showDataError());
const sendData = (body) => load(Route.SEND_DATA, Method.POST, Type.FORM, body);

export {getData, sendData};
