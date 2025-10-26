import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

const LiveClassroom = () => {
    const [message, setMessage] = useState('');
    const ws = useWebSocket('ws://localhost:8000/ws/classroom', (data) => {
        setMessage(data);
    });

    return (
        <div>
            <h1>Live Classroom</h1>
            <p>{message}</p>
        </div>
    );
};

export default LiveClassroom;