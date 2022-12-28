import axios from 'axios';
import authContext from './AuthService';
import ApiConfig from '../config/ApiConfig';
import AdalConfig from '../config/AdalConfig';

/**
 *  Creates an axios instance with the baseURL set to the backend,
 *  and potentially more configuration.
 */
const instance = axios.create(ApiConfig);

/** Ensures current authorization token is included with every request */
instance.interceptors.request.use((config) => {
  let authConfig = config;
  authContext().acquireToken(
    AdalConfig.endpoints.api,
    // eslint-disable-next-line no-unused-vars
    (message, token) => {
      if (token) {
        authConfig = {
          ...config,
          headers: {
            ...config.headers,
            authorization: `Bearer ${token}`,
          },
        };
      }
    },
  );
  return authConfig;
});

export default instance;
