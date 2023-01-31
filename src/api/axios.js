import axios from "axios";

export default axios.create({
    baseURL:'http://localhost:3500'
});
// baseURL set for whole application to prevent retyping later
