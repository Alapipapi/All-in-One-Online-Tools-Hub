import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import Home from './pages/Home';
import About from './pages/About';
import type { Tool } from './types';

type Page = 'home' | 'about';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const openToolModal = (tool: Tool) => {
    setActiveTool(tool);
  };

  const closeToolModal = () => {
    setActiveTool(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans flex flex-col">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentPage === 'home' && <Home onToolClick={openToolModal} />}
        {currentPage === 'about' && <About />}
      </main>
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} All-in-One Tools Hub. All rights reserved.</p>
      </footer>
      
      {activeTool && (
        <Modal
          isOpen={!!activeTool}
          onClose={closeToolModal}
          title={activeTool.name}
        >
          <activeTool.component />
        </Modal>
      )}
    </div>
  );
};

export default App;
