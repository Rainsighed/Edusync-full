import { useState } from 'react';
import { useMistral } from '@/hooks/useMistral';

const LessonBuilder = () => {
    const [content, setContent] = useState('');
    const { analyzeLesson } = useMistral();

    const handleAnalyze = async () => {
        const analysis = await analyzeLesson(content);
        console.log('Analysis:', analysis);
    };

    return (
        <div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <button onClick={handleAnalyze}>Analyze</button>
        </div>
    );
};

export default LessonBuilder;