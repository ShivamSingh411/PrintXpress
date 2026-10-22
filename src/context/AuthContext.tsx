import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
import { DEMO_STUDENT, DEMO_ADMIN } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: Role;
  isAuthenticated: boolean;
  login: (credentials: { emailOrId: string; password?: string; role?: Role }) => Promise<boolean>;
  logout: () => void;
  register: (studentData: Omit<UserProfile, 'id' | 'role'>) => Promise<boolean>;
  demoLogin: (role: Role) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'printxpress_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Aarav Sharma' || !parsed.name) {
          return DEMO_STUDENT;
        }
        return parsed;
      }
      return DEMO_STUDENT;
    } catch {
      return DEMO_STUDENT;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async ({ emailOrId, role = 'student' }: { emailOrId: string; password?: string; role?: Role }) => {
    if (role === 'admin' || emailOrId.toLowerCase().includes('admin')) {
      setUser(DEMO_ADMIN);
      return true;
    }
    // Student login simulation
    const loggedUser: UserProfile = {
      ...DEMO_STUDENT,
      email: emailOrId.includes('@') ? emailOrId : `${emailOrId.toLowerCase()}@college.edu`,
      studentId: emailOrId.toUpperCase(),
      role: 'student',
    };
    setUser(loggedUser);
    return true;
  };

  const register = async (studentData: Omit<UserProfile, 'id' | 'role'>) => {
    const newUser: UserProfile = {
      ...studentData,
      id: `usr-student-${Date.now()}`,
      role: 'student',
    };
    setUser(newUser);
    return true;
  };

  const demoLogin = (selectedRole: Role) => {
    if (selectedRole === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_STUDENT);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isAuthenticated: !!user,
        login,
        logout,
        register,
        demoLogin,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
