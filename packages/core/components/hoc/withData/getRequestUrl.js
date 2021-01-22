import { getEnv } from 'config/irving/multisite';

const getRequestUrl = (endpoint) => {
  const { API_ROOT_URL } = getEnv();

  switch (true) {
    // If endpoint is absolute, use it as-is.
    case endpoint.includes('://'):
      return endpoint;

    // Endpoint is relative, add it to end of configured API_ROOT_URL
    case endpoint.includes('/'):
      return `${API_ROOT_URL}/${endpoint}`;

    // Or use component data endpoint.
    default:
      return `${API_ROOT_URL}/data/${endpoint}`;
  }
};

export default getRequestUrl;
