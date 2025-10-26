import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface UseDnaReturn {
  encodeDna: (data: string) => Promise<string>;
  decodeDna: (encodedData: string) => Promise<string>;
  loading: boolean;
  error: string | null;
}

export const useDna = (): UseDnaReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encodeDna = useCallback(async (data: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/dna/encode`,
        { data },
        { withCredentials: true }
      );
      setLoading(false);
      return response.data.encoded || response.data.result || '';
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to encode DNA';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, []);

  const decodeDna = useCallback(async (encodedData: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/dna/decode`,
        { data: encodedData },
        { withCredentials: true }
      );
      setLoading(false);
      return response.data.decoded || response.data.result || '';
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to decode DNA';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, []);

  return {
    encodeDna,
    decodeDna,
    loading,
    error,
  };
};
