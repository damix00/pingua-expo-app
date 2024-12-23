import axios from "axios";

export const apiConfig = {
    baseUrl: __DEV__
        ? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:9500"
        : "https://pignua-api.latinary.com",
};

export function initAxios() {
    axios.defaults.baseURL = apiConfig.baseUrl;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
}
