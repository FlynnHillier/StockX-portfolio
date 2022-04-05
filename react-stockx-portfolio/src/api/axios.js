import axios from 'axios'

const axios_default = axios.create(
    {
        baseURL:"http://localhost:5000",
        withCredentials: true,
        headers: {'Access-Control-Allow-Origin': '*'}
    }
)

export default axios_default