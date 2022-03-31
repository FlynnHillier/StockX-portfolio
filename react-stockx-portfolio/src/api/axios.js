import {axios as axios_lib} from 'axios'

const axios = axios_lib.create(
    {
        baseURL:"http://localhost:5000"
    }
)

export default axios