import React from 'react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-gray-900/50 p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
    >
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
        {tool.icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{tool.name}</h3>
      <p className="text-gray-600 dark:text-gray-300">{tool.description}</p>
    </div>
  );
};

export default ToolCard;