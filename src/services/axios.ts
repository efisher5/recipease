import axios from "axios";
import { Configuration } from "../openapi/configuration";
import { BASE_PATH } from "../openapi/base";
import { DefaultApi } from "../openapi/api";

const config: Configuration = new Configuration({
    basePath: 'http://localhost:3000/api'
})

const axiosInstance = axios.create({
    baseURL: config.basePath
})

export const defaultApi = new DefaultApi(
    config,
    config.basePath,
    axiosInstance
)

export const setRequestHeaders = function (headers: Array<any>) {
    headers.forEach(header => {
        axiosInstance.defaults.headers.common[header.key] = header.value
    })
}

export default axiosInstance;