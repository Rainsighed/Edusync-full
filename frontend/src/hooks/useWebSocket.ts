import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url: string, onMessage: (data: string) => void) => {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        wsRef.current = new WebSocket(url);

        wsRef.current.onmessage = (event) => {
            onMessage(event.data);
        };

        return () => {
            wsRef.current?.close();
        };
    }, [url, onMessage]);

    const sendMessage = (data: string) => {
        wsRef.current?.send(data);
    };

    return { sendMessage };
};

export default useWebSocket;
