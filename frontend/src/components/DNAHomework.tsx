import { useState } from 'react';
import { useDna } from '@/hooks/useDna';

const DNAHomework: React.FC = () => {
    const [data, setData] = useState<string>('');
    const [encodedData, setEncodedData] = useState<string | null>(null);
    const [decodedData, setDecodedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { encodeDna, decodeDna } = useDna();

    const handleEncode = async () => {
        try {
            const encoded = await encodeDna(data);
            setEncodedData(encoded);
            console.log('Encoded:', encoded);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDecode = async () => {
        try {
            const decoded = await decodeDna(data);
            setDecodedData(decoded);
            console.log('Decoded:', decoded);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>DNA Homework</h1>
            <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Enter data to encode or decode"
            />
            <button onClick={handleEncode}>Encode</button>
            <button onClick={handleDecode}>Decode</button>
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {encodedData && <div>Encoded: {encodedData}</div>}
            {decodedData && <div>Decoded: {decodedData}</div>}
        </div>
    );
};

export default DNAHomework;