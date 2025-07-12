import { useState, useEffect } from 'react';
import axios from 'axios';

const useMistral = () => {
    const [loading, setLoading] = useState(false);

    const analyzeLesson = async (content: string) => {
        setLoading(true);
        const response = await axios.post('/api/v1/lessons/analyze', { content });
        setLoading(false);
        return response.data.analysis;
    };

    return { analyzeLesson, loading };
};

export default useMistral;