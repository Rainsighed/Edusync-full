import { useState } from 'react';
import LessonBuilder from '@/components/LessonBuilder';

const Home = () => {
    return (
        <div>
            <h1>Welcome to Edusync</h1>
            <LessonBuilder />
        </div>
    );
};

export default Home;
