import axios from "axios";
import { Configuration } from "../openapi/configuration";
import { DefaultApi } from "../openapi/api";
const VITE_API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;

const config: Configuration = new Configuration({
    basePath: VITE_API_BASE_PATH
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