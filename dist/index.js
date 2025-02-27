"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapper = void 0;
const http_1 = require("http-cookie-agent/http");
function requestInterceptor(config) {
    if (!config.jar) {
        return config;
    }
    // @ts-expect-error ...
    if (config.jar === true) {
        throw new Error('config.jar does not accept boolean since axios-cookiejar-support@2.0.0.');
    }
    if (config.httpAgent || config.httpsAgent) {
        throw new Error('axios-cookiejar-support does not support for use with other http(s).Agent.');
    }
    config.httpAgent = new http_1.HttpCookieAgent({ cookies: { jar: config.jar } });
    config.httpsAgent = new http_1.HttpsCookieAgent({ cookies: { jar: config.jar } });
    return config;
}
function wrapper(axios) {
    const isWrapped = axios.interceptors.request.handlers.find(({ fulfilled }) => fulfilled === requestInterceptor);
    if (isWrapped) {
        return axios;
    }
    axios.interceptors.request.use(requestInterceptor);
    if ('create' in axios) {
        const create = axios.create;
        axios.create = (...args) => {
            const instance = create.apply(axios, args);
            instance.interceptors.request.use(requestInterceptor);
            return instance;
        };
    }
    return axios;
}
exports.wrapper = wrapper;
