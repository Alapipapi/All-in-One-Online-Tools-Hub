import React from 'react';
import { TOOLS } from '../constants';

const About: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight text-center">
        About <span className="text-blue-600 dark:text-blue-500">Tools Hub</span>
      </h1>
      <div className="mt-8 prose lg:prose-xl dark:prose-invert mx-auto">
        <p className="lead text-center">
          Welcome to the All-in-One Online Tools Hub! Our mission is to provide a collection of simple, free, and efficient utilities to help you with your everyday digital tasks. No need to browse multiple websites—we've gathered the essentials right here for you.
        </p>
        
        <h2 className="mt-16 text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">What We Offer</h2>
        <p>
          Our platform is designed with simplicity and user experience in mind. All our tools are client-side, meaning your data is processed directly in your browser for maximum privacy and speed. Here's a quick look at the tools you can use:
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
            {TOOLS.map(tool => (
                <div key={tool.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-start space-x-4">
                    <div className="flex-shrink-0 text-blue-500">
                        {React.cloneElement(tool.icon, { className: "w-8 h-8" })}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{tool.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <h2 className="mt-16 text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">Our Philosophy</h2>
        <p>
          We believe in the power of accessible technology. Whether you're a student, a professional, or just someone looking to quickly get something done, our tools are built to be intuitive and reliable. We are constantly looking to improve and expand our collection, so stay tuned for more useful utilities in the future!
        </p>
      </div>
    </div>
  );
};

export default About;
