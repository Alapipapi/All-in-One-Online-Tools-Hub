import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const TextSummarizer: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSummarize = useCallback(async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to summarize.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSummary('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Summarize the following text into a few key points, in a concise and easy-to-read format.:\n\n${inputText}`,
            });
            
            setSummary(response.text);

        } catch (e: any) {
            console.error(e);
            setError(`Failed to generate summary. API Error: ${e.message || 'An unknown error occurred.'}`);
        } finally {
            setIsLoading(false);
        }
    }, [inputText]);

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text to Summarize
                </label>
                <textarea
                    id="text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your article, essay, or any long text here..."
                    className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y"
                    aria-label="Text input for summarization"
                />
            </div>

            <button
                onClick={handleSummarize}
                disabled={isLoading || !inputText.trim()}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? <><Spinner /> Summarizing...</> : 'Summarize Text'}
            </button>
            
            {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {summary && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Summary:</h3>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-pre-wrap dark:text-gray-200 text-gray-800">
                        {summary}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextSummarizer;
