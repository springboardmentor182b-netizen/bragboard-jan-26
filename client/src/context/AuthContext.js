import React, { createContext, useContext } from 'react';

/**
 * Placeholder AuthContext.
 * Auth is handled by a separate module.
 * Kept here for future integration only.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
