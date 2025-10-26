import { useState } from 'react';
import { useDna } from '@/hooks/useDna';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

const DNAHomework: React.FC = () => {
    const [data, setData] = useState<string>('');
    const [encodedData, setEncodedData] = useState<string | null>(null);
    const [decodedData, setDecodedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { encodeDna, decodeDna, loading } = useDna();

    const handleEncode = async () => {
        setError(null);
        setEncodedData(null);
        try {
            const encoded = await encodeDna(data);
            setEncodedData(encoded);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDecode = async () => {
        setError(null);
        setDecodedData(null);
        try {
            const decoded = await decodeDna(data);
            setDecodedData(decoded);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-3xl">
            <Card>
                <Textarea
                    label="Input Data"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder="Enter data to encode or decode"
                    rows={6}
                    className="mb-4"
                />

                <div className="flex gap-3 mb-4">
                    <Button
                        variant="primary"
                        onClick={handleEncode}
                        loading={loading}
                        disabled={!data || loading}
                    >
                        Encode to DNA
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleDecode}
                        loading={loading}
                        disabled={!data || loading}
                    >
                        Decode from DNA
                    </Button>
                </div>

                {error && (
                    <Alert
                        variant="error"
                        message={error}
                        onDismiss={() => setError(null)}
                    />
                )}
            </Card>

            {encodedData && (
                <Card title="Encoded Result" className="mt-4">
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm break-all">
                        {encodedData}
                    </div>
                </Card>
            )}

            {decodedData && (
                <Card title="Decoded Result" className="mt-4">
                    <div className="bg-gray-50 p-4 rounded text-sm">
                        {decodedData}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default DNAHomework;