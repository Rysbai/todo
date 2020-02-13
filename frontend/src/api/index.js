import axios from 'axios';
import config  from '../config';

const MAIN_URL = config.PROTOCOL + '://' + config.TO_DO_API_HOST + ":" + config.TO_DO_API_PORT;
const AUTH_PREFIX = 'Bearer';

export default {
  login: (username, password) => {
    const url = MAIN_URL + '/api/users/login';
    return axios.post(url, {username, password});
  },

  getToDos: (actual) => {
    const token = localStorage.getItem('token');
    const url = MAIN_URL + '/api/todos';
    if (actual){
      return axios.get(url + '?actual=True', {headers: {Authorization: `${AUTH_PREFIX} ${token}`}})
    }
    return axios.get(url, {headers: {Authorization: `${AUTH_PREFIX} ${token}`}})
  },

  getActualToDos: () => {
    const token = localStorage.getItem('token');
    const url = MAIN_URL + '/api/todos?actual=True';
    return axios.get(url, {headers: {Authorization: `${AUTH_PREFIX} ${token}`}})
  },

  setToDoStatus: (todo, isDone) => {
    const token = localStorage.getItem('token');
    const url = MAIN_URL + `/api/todos/${todo.id}`;
    const data = {
      ...todo,
      is_done: isDone
    };

    return axios.put(url, data, {headers: {Authorization: `${AUTH_PREFIX} ${token}`}})
  },


  createTodo: (todo) => {
    const token = localStorage.getItem('token');
    const url = MAIN_URL + `/api/todos`;

    return axios.post(url, todo, {headers: {Authorization: `${AUTH_PREFIX} ${token}`}})
  },

  signup: (username, email, name, surname, password) => {
    const url = MAIN_URL + '/api/users/signup';
    const data = {
      username,
      email,
      name,
      surname,
      password
    };
    return axios.post(url, data)
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    const url = MAIN_URL + `/api/users/current`;

    return axios.get(url, {headers: {Authorization: `${AUTH_PREFIX} ${token}`}})
  },

  confirmEmail: (key) => {
    const token = localStorage.getItem('token');
    const url = MAIN_URL + `/api/users/confirm_email/${key}`;

    return axios.get(url, {headers: {Authorization: `${AUTH_PREFIX} ${token}`}})
  }
}