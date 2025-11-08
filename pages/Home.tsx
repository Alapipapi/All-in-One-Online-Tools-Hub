import React from 'react';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import { TOOLS } from '../constants';
import type { Tool } from '../types';

interface HomeProps {
  onToolClick: (tool: Tool) => void;
}

const Home: React.FC<HomeProps> = ({ onToolClick }) => {
  return (
    <>
      <Hero />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onClick={() => onToolClick(tool)} />
        ))}
      </div>
    </>
  );
};

export default Home;
