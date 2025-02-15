import axios from "axios";

export const apiConfig = {
    // baseUrl: __DEV__
    //     ? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:9500"
    //     : "https://pingua-api.latinary.com",
    baseUrl: "https://pingua-api.latinary.com",
};

export function initAxios() {
    axios.defaults.baseURL = apiConfig.baseUrl;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    axios.defaults.timeout = 30 * 1000; // 30 seconds
    axios.defaults.validateStatus = (status) => true; // Prevents axios from throwing errors on non-2xx status codes
}
