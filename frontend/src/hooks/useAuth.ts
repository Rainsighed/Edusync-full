import { useState, useCallback } from 'react';
import axios from 'axios';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const getCurrentUser = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setState({
        user: response.data,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error: any) {
      setState({
        user: null,
        loading: false,
        error: error.response?.data?.detail || 'Failed to get user',
        isAuthenticated: false,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setState({
        user: response.data.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.detail || 'Login failed',
      }));
      throw error;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        { email, password, name },
        { withCredentials: true }
      );
      setState({
        user: response.data.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.detail || 'Signup failed',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.detail || 'Logout failed',
      }));
    }
  }, []);

  return {
    ...state,
    login,
    signup,
    logout,
    getCurrentUser,
    clearError,
  };
};
