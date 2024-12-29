import axios from "axios";

let jwt = "";

export function getJwt() {
    return jwt;
}

export function setJwt(newJwt: string) {
    jwt = newJwt;

    axios.defaults.headers.common["Authorization"] = newJwt ?? "";
}
