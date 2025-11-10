import React, { useState, useMemo } from 'react';

const TextAnalyzer: React.FC = () => {
    const [text, setText] = useState('');

    const stats = useMemo(() => {
        const trimmedText = text.trim();
        
        const charactersWithSpaces = text.length;
        const charactersWithoutSpaces = text.replace(/\s/g, '').length;
        
        const words = trimmedText ? trimmedText.split(/\s+/).length : 0;

        const sentenceMatches = trimmedText.match(/[^.!?]+[.!?]+/g);
        const sentenceCount = sentenceMatches ? sentenceMatches.length : (trimmedText ? 1 : 0);

        const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
        
        const readingTime = Math.ceil(words / 200); // Average reading speed: 200 wpm

        return {
            charactersWithSpaces,
            charactersWithoutSpaces,
            words,
            sentences: sentenceCount,
            paragraphs,
            readingTime
        };
    }, [text]);

    const StatCard = ({ label, value }: { label: string, value: string | number }) => (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your text here..."
                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y"
                aria-label="Text input for analysis"
            />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard label="Characters (incl. spaces)" value={stats.charactersWithSpaces} />
                <StatCard label="Characters (excl. spaces)" value={stats.charactersWithoutSpaces} />
                <StatCard label="Words" value={stats.words} />
                <StatCard label="Sentences" value={stats.sentences} />
                <StatCard label="Paragraphs" value={stats.paragraphs} />
                <StatCard label="Reading Time" value={`${stats.readingTime} min`} />
            </div>

            <button
                onClick={() => setText('')}
                className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50"
                disabled={!text}
            >
                Clear Text
            </button>
        </div>
    );
};

export default TextAnalyzer;