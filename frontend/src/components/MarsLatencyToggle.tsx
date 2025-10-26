import { useState } from 'react';

const MarsLatencyToggle = () => {
    const [latency, setLatency] = useState<number>(0);

    const handleToggle = () => {
        setLatency((prevLatency) => (prevLatency === 0 ? 1320000 : 0)); // 22 minutes in milliseconds
    };

    return (
        <div className="mars-latency-toggle">
            <label htmlFor="mars-latency-toggle-button">
                Mars Latency: {latency / 1000} seconds
            </label>
            <button
                id="mars-latency-toggle-button"
                onClick={handleToggle}
                aria-label="Toggle Mars Latency"
            >
                Toggle
            </button>
        </div>
    );
};

export default MarsLatencyToggle;