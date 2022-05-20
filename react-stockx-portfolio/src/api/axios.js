import axios from 'axios'

const axios_default = axios.create(
    {
        baseURL:"/",
        withCredentials: true,
        headers: {'Access-Control-Allow-Origin': '*'}
    }
)

export default axios_default