import LiveClassroom from '@/components/LiveClassroom';
import MarsLatencyToggle from '@/components/MarsLatencyToggle';

const Classroom = () => {
    return (
        <div>
            <h1>Live Classroom</h1>
            <LiveClassroom />
            <MarsLatencyToggle />
        </div>
    );
};

export default Classroom;