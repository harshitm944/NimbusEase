import axios from 'axios';

// Function to get a cookie by name (Only kept if absolutely needed for other non-sensitive cookies)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const API_URL = 'http://localhost:3000/api/v1/';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is crucial for sending HttpOnly cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Minimal logging, no manual Authorization header needed for HttpOnly cookies
apiClient.interceptors.request.use(
  (config) => {
    const targetUrl = config.url.startsWith('/') ? config.url.substring(1) : config.url;
    console.log(`[AXIOS] Requesting: ${config.baseURL}${targetUrl}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    console.error(`[AXIOS] Error from ${originalRequest.url}:`, error.response?.data || error.message);

    // Only handle 401 errors and ensure we don't get into a refresh loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[AXIOS] Access token expired. Attempting to refresh...');
        // The backend /auth/refresh route will receive the refreshToken cookie 
        // and set a new accessToken cookie in the response.
        await apiClient.get('auth/refresh');
        console.log('[AXIOS] Token refresh successful.');
        
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('[AXIOS] Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        // Here you would typically trigger a logout action
        // For example: window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
