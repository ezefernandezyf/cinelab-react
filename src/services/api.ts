import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3';

let axiosInstance: AxiosInstance;

const createAxios = (baseURL: string) => {
  axiosInstance = axios.create({ baseURL, timeout: 10_000 });
};

const setupInterceptors = () => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      if (!config.params) {
        config.params = {};
      }
      if (!('api_key' in config.params)) {
        config.params.api_key = apiKey;
      }
      if (import.meta.env.DEV) {
        console.debug('Request to: ', config.url, config.params);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (import.meta.env.DEV) {
        console.debug('Response from:', response.config.url, { status: response.status });
      }
      return response;
    },
    (error) => {
      if (import.meta.env.DEV) {
        if (error?.response) {
          console.error('Error response from:', error.response.config?.url, {
            status: error.response.status,
            data: error.response.data,
          });
        } else {
          console.error('Network or other error:', error.message);
        }
      }
      return Promise.reject(error);
    }
  );
};

export const initAxios = () => {
  createAxios(BASE_URL);
  setupInterceptors();
  return axiosInstance;
};

export async function apiGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  if (!axiosInstance) {
    initAxios();
  }
  const res = await axiosInstance.get<T>(url, config);
  return res.data;
}
