import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="text-center py-16 animate-fade-in">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
        Your Everyday <span className="text-blue-600 dark:text-blue-500">Online Tools</span>, All in One Place.
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
        Simplify your daily tasks with our collection of free, easy-to-use online utilities. From unit conversions to password generation, we've got you covered.
      </p>
    </section>
  );
};

export default Hero;