import axios from 'axios';
import config  from '../config';

const mainUrl = config.PROTOCOL + '://' + config.TO_DO_API_HOST + ":" + config.TO_DO_API_PORT;

export default {
  login: (username, password) => {
    const url = mainUrl + '/api/users/login';
    return axios.post(url, {username, password});
  }
}