import { use } from 'react';

import { AuthContext } from '../context/jwt';

export const useAuth = () => {
  const context = use(AuthContext);

  if (!context)
    throw new Error('useAuthContext context must be use inside AuthProvider');

  return context;
};
