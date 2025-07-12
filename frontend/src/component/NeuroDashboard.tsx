import React, { useState, useEffect } from 'react';

const NeuroDashboard: React.FC = () => {
    const [data, setData] = useState<Record<string, unknown>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/v1/classroom/neuro')
            .then((res: Response) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((json: Record<string, unknown>) => {
                setData(json);
            })
            .catch((err: Error) => {
                setError(err.message);
            });
    }, []);

    return (
        <div>
            <h1>Neuro Dashboard</h1>
            {error ? (
                <div style={{ color: 'red' }}>Error: {error}</div>
            ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    );
};

export default NeuroDashboard;