import { Layout } from '@/components/layout/Layout';
import LessonBuilder from '@/components/LessonBuilder';

const Home = () => {
    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                    Lesson Builder
                </h1>
                <p className="text-gray-600 mb-6">
                    Analyze lesson content using AI-powered insights from Mistral
                </p>
                <LessonBuilder />
            </div>
        </Layout>
    );
};

export default Home;
