import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as apiLogin, logout as apiLogout, registerAuthTokens, signup as apiSignup } from '../api/client';
import { AuthTokens, UserProfile } from '../types';

type AuthState = {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  loading: boolean;
  intendedPath?: string;
};

type AuthContextValue = {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  loading: boolean;
  intendedPath?: string;
  setIntendedPath: (path?: string) => void;
  signup: (username: string, email: string, password: string, displayName?: string) => Promise<void>;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'bourbonbuddy.tokens';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, tokens: null, loading: true });

  const setTokens = useCallback((tokens: AuthTokens | null) => {
    setState((current) => ({ ...current, tokens }));
    if (tokens) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  registerAuthTokens(() => state.tokens, setTokens);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setState((current) => ({ ...current, tokens: JSON.parse(stored) as AuthTokens }));
    } else {
      setState((current) => ({ ...current, loading: false }));
    }
  }, []);

  useEffect(() => {
    async function hydrate() {
      if (!state.tokens) {
        setState((current) => ({ ...current, user: null, loading: false }));
        return;
      }

      try {
        const me = await getMe();
        setState((current) => ({ ...current, user: me, loading: false }));
      } catch (error) {
        console.error('Failed to hydrate auth state', error);
        setTokens(null);
        setState((current) => ({ ...current, user: null, loading: false }));
      }
    }

    if (state.loading) {
      hydrate();
    }
  }, [setTokens, state.loading, state.tokens]);

  const signup = useCallback(
    async (username: string, email: string, password: string, displayName?: string) => {
      const result = await apiSignup(username, email, password, displayName);
      setTokens(result.tokens);
      setState((current) => ({ ...current, user: result.user, loading: false, intendedPath: undefined }));
    },
    [setTokens]
  );

  const login = useCallback(
    async (usernameOrEmail: string, password: string) => {
      const result = await apiLogin(usernameOrEmail, password);
      setTokens(result.tokens);
      setState((current) => ({ ...current, user: result.user, loading: false, intendedPath: undefined }));
    },
    [setTokens]
  );

  const logout = useCallback(async () => {
    if (state.tokens?.refreshToken) {
      await apiLogout(state.tokens.refreshToken).catch(() => undefined);
    }
    setTokens(null);
    setState((current) => ({ ...current, user: null }));
  }, [setTokens, state.tokens]);

  const setIntendedPath = useCallback((path?: string) => {
    setState((current) => ({ ...current, intendedPath: path }));
  }, []);

  const value = useMemo(
    () => ({ user: state.user, tokens: state.tokens, loading: state.loading, intendedPath: state.intendedPath, signup, login, logout, setIntendedPath }),
    [login, logout, signup, state.intendedPath, state.loading, state.tokens, state.user, setIntendedPath]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
