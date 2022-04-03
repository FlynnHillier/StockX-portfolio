import axios from 'axios'

const axios_default = axios.create(
    {
        baseURL:"http://78.143.196.64:5000"
    }
)

export default axios_default