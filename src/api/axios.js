import axios from "axios";

const BASE_URL = 'http://localhost:3500';

export default axios.create({
    baseURL:BASE_URL
});
// baseURL set for whole application to prevent retyping later


export const axiosPrivate =  axios.create({
    baseURL:BASE_URL,
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true
});

// Going to attach interceptors to the axios private that attaches the JWT tokens and retries when failure (404) occurs 
// interceptors: work with JWT tokens to refresh the token if initial request is denied 
