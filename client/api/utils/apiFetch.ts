import { addRefreshToken } from './shared';

export const serverFetch = addRefreshToken('http://localhost:4000/api/auth/refresh');
