import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Activity, Brain, Zap, Battery } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface NeuroMetrics {
  attention: number;
  focus: number;
  engagement: number;
}

interface BCIData {
  status: string;
  data: {
    signal_strength: number;
    connected: boolean;
    device_id: string;
    battery_level: number;
  };
}

const Analytics = () => {
  const [neuroData, setNeuroData] = useState<NeuroMetrics | null>(null);
  const [bciData, setBciData] = useState<BCIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [neuroRes, bciRes] = await Promise.all([
          axios.get(`${API_URL}/classroom/neuro`, { withCredentials: true }),
          axios.get(`${API_URL}/classroom/bci`, { withCredentials: true })
        ]);

        setNeuroData(neuroRes.data.metrics);
        setBciData(bciRes.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load analytics data');
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}%</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </Card>
  );

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Real-time neuro metrics and BCI data monitoring
        </p>

        {error && (
          <Alert
            variant="error"
            message={error}
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Neuro Metrics */}
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Neuro Metrics</h2>
              <div className="space-y-4">
                {neuroData && (
                  <>
                    <MetricCard
                      title="Attention"
                      value={neuroData.attention}
                      icon={Brain}
                      color="text-blue-600"
                    />
                    <MetricCard
                      title="Focus"
                      value={neuroData.focus}
                      icon={Activity}
                      color="text-green-600"
                    />
                    <MetricCard
                      title="Engagement"
                      value={neuroData.engagement}
                      icon={Zap}
                      color="text-purple-600"
                    />
                  </>
                )}
              </div>
            </div>

            {/* BCI Data */}
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">BCI Status</h2>
              <Card>
                {bciData && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status</span>
                      <Badge variant={bciData.status === 'connected' ? 'success' : 'error'}>
                        {bciData.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Device ID</span>
                      <span className="text-sm text-gray-600 font-mono">{bciData.data.device_id}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Signal Strength</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${bciData.data.signal_strength * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round(bciData.data.signal_strength * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Battery size={16} />
                        Battery Level
                      </span>
                      <span className="text-sm text-gray-600">{bciData.data.battery_level}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Connection</span>
                      <Badge variant={bciData.data.connected ? 'success' : 'error'}>
                        {bciData.data.connected ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
