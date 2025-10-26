import { Layout } from '@/components/layout/Layout';
import DNAHomework from '@/components/DNAHomework';

const Homework = () => {
    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                    DNA Homework
                </h1>
                <p className="text-gray-600 mb-6">
                    Encode and decode data using DNA sequences
                </p>
                <DNAHomework />
            </div>
        </Layout>
    );
};

export default Homework;
