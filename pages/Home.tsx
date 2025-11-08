import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import { TOOLS } from '../constants';
import type { Tool } from '../types';

interface HomeProps {
  onToolClick: (tool: Tool) => void;
}

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const Home: React.FC<HomeProps> = ({ onToolClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery) {
      return TOOLS;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return TOOLS.filter(tool =>
      tool.name.toLowerCase().includes(lowerCaseQuery) ||
      tool.description.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  return (
    <>
      <Hero />
      <div className="mt-8 mb-12 max-w-2xl mx-auto animate-fade-in">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search for a tool (e.g., 'password', 'pdf')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            aria-label="Search for tools"
          />
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => onToolClick(tool)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Tools Found</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                Sorry, we couldn't find any tools matching "{searchQuery}". Try a different search term.
            </p>
        </div>
      )}
    </>
  );
};

export default Home;