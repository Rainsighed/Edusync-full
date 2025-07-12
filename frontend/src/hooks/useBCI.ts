import { useState, useEffect } from 'react';
import axios from 'axios';

const useBCI = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api/v1/classroom/bci');
            setData(response.data);
        };
        fetchData();
    }, []);

    return data;
};

export default useBCI;