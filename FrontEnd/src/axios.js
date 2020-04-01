import axios from 'axios';

export default axios.create({
    baseURL: 'http://13.235.43.83:8000',
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': window.localStorage.getItem('Authorization'),
    // }
});