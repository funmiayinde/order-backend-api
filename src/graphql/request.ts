/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';

const baseUrl = process.env.BASE_URL;

const defaultOptions = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  baseURL: baseUrl,
  headers: {},
};

const instance = axios.create(defaultOptions);

instance.interceptors.request.use((error) => {
  // Do something with request error
  return Promise.reject(error);
});

instance.interceptors.response.use(
  (response) => {
    // Do something wth response data
    console.log('interceptors-response:', response);
    return response.data;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a task-status code
      // that falls out of the range of 2xx
      // throw error.response.data;
      const { data, status, statusText } = error.response;
      return Promise.reject({ ...data, statusCode: status, statusText });
    } else if (error.request) {
      // The request was made but no response received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest is node.js
      console.log('error request', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error:', error);
    }
  },
);

/**
 * create request
 * @param {Object} config The request object
 * @returns {Object} The response object
 */
export const createRequest = (config: AxiosRequestConfig<any>) => instance(config);
