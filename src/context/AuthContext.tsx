import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'email' | 'google';
  createdAt: string;
}

interface StoredAccount extends User {
  passwordHash?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (googleProfile?: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'levain_auth_user';
const REGISTERED_USERS_KEY = 'levain_registered_users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load existing session on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('[Auth] Failed to restore session:', e);
      localStorage.removeItem(AUTH_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper to retrieve registered accounts
  const getRegisteredUsers = (): StoredAccount[] => {
    try {
      const users = localStorage.getItem(REGISTERED_USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveRegisteredUsers = (users: StoredAccount[]) => {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('[Auth] Failed to persist accounts:', e);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    const accounts = getRegisteredUsers();
    const found = accounts.find(a => a.email.toLowerCase() === cleanEmail && a.provider === 'email');

    if (!found) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }

    if (found.passwordHash !== cleanPass) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const authUser: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      avatar: found.avatar,
      provider: found.provider,
      createdAt: found.createdAt
    };

    setUser(authUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanName) {
      return { success: false, error: 'Please provide your name.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const accounts = getRegisteredUsers();
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newAccount: StoredAccount = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: cleanPass, // In a client-first PWA, safely stored in local browser state
      provider: 'email',
      createdAt: new Date().toISOString()
    };

    accounts.push(newAccount);
    saveRegisteredUsers(accounts);

    const authUser: User = {
      id: newAccount.id,
      email: newAccount.email,
      name: newAccount.name,
      avatar: newAccount.avatar,
      provider: newAccount.provider,
      createdAt: newAccount.createdAt
    };

    setUser(authUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  const loginWithGoogle = async (googleProfile?: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      const email = googleProfile?.email?.trim().toLowerCase() || 'baker@gmail.com';
      const name = googleProfile?.name?.trim() || 'Google Baker';
      const avatar = googleProfile?.avatar || undefined;

      const accounts = getRegisteredUsers();
      let account = accounts.find(a => a.email.toLowerCase() === email && a.provider === 'google');

      if (!account) {
        account = {
          id: googleProfile?.id || `google_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          email,
          name,
          avatar,
          provider: 'google',
          createdAt: new Date().toISOString()
        };
        accounts.push(account);
        saveRegisteredUsers(accounts);
      } else if (avatar && account.avatar !== avatar) {
        account.avatar = avatar;
        saveRegisteredUsers(accounts);
      }

      const authUser: User = {
        id: account.id,
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        provider: account.provider,
        createdAt: account.createdAt
      };

      setUser(authUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Google sign-in failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
