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
    const [copied, setCopied] = useState(false);

    const handleSummarize = useCallback(async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to summarize.');
            return;
        }
        setIsLoading(true);
        setSummary('');
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Summarize the following text into a few key points:\n\n---\n\n${inputText}`;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            setSummary(response.text);

        } catch (err) {
            console.error(err);
            setError('Failed to generate summary. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [inputText]);

    const copyToClipboard = () => {
        if (!summary) return;
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text to Summarize
                </label>
                <textarea
                    id="input-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste a long article or any text you want to summarize..."
                    className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y"
                    aria-label="Text input for summarization"
                />
            </div>
            
            <button
                onClick={handleSummarize}
                disabled={isLoading || !inputText}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? <><Spinner /> Summarizing...</> : 'Summarize Text'}
            </button>

            {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
                    <p>{error}</p>
                </div>
            )}

            {summary && (
                <div className="space-y-2">
                    <label htmlFor="summary-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Summary
                    </label>
                    <div className="relative">
                        <div
                            id="summary-output"
                            className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 overflow-y-auto whitespace-pre-wrap"
                        >
                            {summary}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextSummarizer;