import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, DEMO_ADMIN, DEMO_CITIZENS } from '../types/auth';

/**
 * ============================================================================
 * NOTE: MOCK AUTHENTICATION SYSTEM (DEMONSTRATION PROTOTYPE)
 * ============================================================================
 * This authentication module is built using browser localStorage for hackathon
 * prototype demonstration and offline resilience.
 *
 * Real production deployment will transition to Supabase Auth (or government
 * OAuth/MeriPehchaan/SSO) utilizing secure JWTs, HTTP-only session cookies,
 * and PostgreSQL Row Level Security (RLS) policies.
 *
 * WARNING: Passwords are simulated demo credentials and should NEVER be
 * stored or transmitted in plain text in production applications!
 * ============================================================================
 */

const AUTH_USER_KEY = 'sevasaarthi_auth_user';
const REGISTERED_USERS_KEY = 'sevasaarthi_registered_users';

interface RegisteredUserRecord {
  user: User;
  demoPassword: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCitizen: boolean;
  login: (identifier: string, password: string, role: UserRole) => { success: boolean; user?: User; error?: string };
  signup: (data: {
    name: string;
    emailOrPhone: string;
    password: string;
    preferredLanguage?: 'en' | 'te' | 'hi';
  }) => { success: boolean; user?: User; error?: string };
  quickLogin: (demoUser: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse auth user from localStorage', err);
    }
    return null;
  });

  // Keep localStorage updated when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const getRegisteredUsers = (): RegisteredUserRecord[] => {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to load registered users', err);
    }
    return [];
  };

  const login = (
    identifier: string,
    password: string,
    role: UserRole
  ): { success: boolean; user?: User; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (role === 'admin') {
      const adminMatch =
        (DEMO_ADMIN.user.emailOrPhone.toLowerCase() === cleanId || cleanId === 'admin') &&
        DEMO_ADMIN.demoPassword === cleanPass;

      if (adminMatch) {
        setUser(DEMO_ADMIN.user);
        return { success: true, user: DEMO_ADMIN.user };
      }
      return { success: false, error: 'Invalid admin credentials. Please use demo credentials shown below.' };
    }

    // Citizen login check: first check seeded accounts
    const seededMatch = DEMO_CITIZENS.find(
      (c) =>
        (c.user.emailOrPhone.toLowerCase() === cleanId ||
          c.user.name.toLowerCase() === cleanId ||
          c.user.id.toLowerCase() === cleanId) &&
        c.demoPassword === cleanPass
    );

    if (seededMatch) {
      setUser(seededMatch.user);
      return { success: true, user: seededMatch.user };
    }

    // Check newly registered user accounts
    const registered = getRegisteredUsers();
    const registeredMatch = registered.find(
      (r) =>
        r.user.emailOrPhone.toLowerCase() === cleanId &&
        r.demoPassword === cleanPass &&
        r.user.role === 'citizen'
    );

    if (registeredMatch) {
      setUser(registeredMatch.user);
      return { success: true, user: registeredMatch.user };
    }

    return {
      success: false,
      error: 'Invalid phone, email or password. You can also pick a 1-click Demo Citizen account below.',
    };
  };

  const signup = (data: {
    name: string;
    emailOrPhone: string;
    password: string;
    preferredLanguage?: 'en' | 'te' | 'hi';
  }): { success: boolean; user?: User; error?: string } => {
    const cleanName = data.name.trim();
    const cleanId = data.emailOrPhone.trim();
    const cleanPass = data.password.trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter your full citizen name (at least 2 characters).' };
    }

    if (!cleanId || cleanId.length < 5) {
      return { success: false, error: 'Please enter a valid phone number (10 digits) or email address.' };
    }

    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters for this demo.' };
    }

    // Check if phone or email is already registered
    const registered = getRegisteredUsers();
    const isConflict =
      registered.some((r) => r.user.emailOrPhone.toLowerCase() === cleanId.toLowerCase()) ||
      DEMO_CITIZENS.some((c) => c.user.emailOrPhone.toLowerCase() === cleanId.toLowerCase());

    if (isConflict) {
      return { success: false, error: 'An account with this phone or email already exists. Please log in.' };
    }

    const newUser: User = {
      id: `citizen-reg-${Date.now()}`,
      name: cleanName,
      emailOrPhone: cleanId,
      role: 'citizen',
      preferredLanguage: data.preferredLanguage || 'te',
      isDemo: false,
    };

    const newRecord: RegisteredUserRecord = {
      user: newUser,
      demoPassword: cleanPass,
    };

    registered.push(newRecord);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));

    // Auto-login upon successful registration
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const quickLogin = (demoUser: User) => {
    setUser(demoUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isCitizen: user?.role === 'citizen',
        login,
        signup,
        quickLogin,
        logout,
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
