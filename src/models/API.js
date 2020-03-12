import axios from 'axios';

const API = {
  url() {
    return process.env.REACT_APP_MUSIFY_API_URL;
  },
  get(endpoint, params) {
    return new Promise((resolve, reject) => {
      axios.get(API.url() + endpoint, { params }).then(data => resolve(data.data)).catch(reject);
    });
  }
};

export default API;