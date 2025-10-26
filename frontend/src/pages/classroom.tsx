import { Layout } from '@/components/layout/Layout';
import LiveClassroom from '@/components/LiveClassroom';
import MarsLatencyToggle from '@/components/MarsLatencyToggle';

const Classroom = () => {
    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                    Live Classroom
                </h1>
                <p className="text-gray-600 mb-6">
                    Real-time classroom communication with WebSocket and Mars latency simulation
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <LiveClassroom />
                    </div>
                    <div>
                        <MarsLatencyToggle />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Classroom;