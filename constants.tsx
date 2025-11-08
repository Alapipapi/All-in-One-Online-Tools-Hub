
import React from 'react';
import type { Tool } from './types';
import UnitConverter from './components/tools/UnitConverter';
import PdfTools from './components/tools/PdfTools';
import PasswordGenerator from './components/tools/PasswordGenerator';
import Calculator from './components/tools/Calculator';
import ImageCompressor from './components/tools/ImageCompressor';

// SVG Icons as React components
const ScaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.14-.354-6.044-.962l-1.551-.463m0 0l-2.62 10.726c-.122.499.106 1.028.589 1.202a5.989 5.989 0 002.036.243c2.132 0 4.14-.354 6.044-.962l1.551-.463m-4.5-8.132c.311.092.622.182.933.267m-1.551-.463c.311.092.622.182.933.267m0 0c-2.132 0-4.14-.354-6.044-.962l-1.551-.463M4.501 19.11l-2.62-10.726c-.122-.499.106-1.028.589-1.202a5.989 5.989 0 012.036-.243c2.132 0 4.14.354 6.044.962l1.551.463" />
  </svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const CalculatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.25-4.5h.008v.008H10.5v-.008zm0 2.25h.008v.008H10.5v-.008zm0 2.25h.008v.008H10.5v-.008zm2.25-4.5h.008v.008H12.75v-.008zm0 2.25h.008v.008H12.75v-.008zm0 2.25h.008v.008H12.75v-.008zm2.25-4.5h.008v.008H15v-.008zm0 2.25h.008v.008H15v-.008zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
);
  
const PhotoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const TOOLS: Tool[] = [
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, weight, and temperature units instantly.',
    icon: <ScaleIcon className="w-12 h-12 text-blue-500" />,
    component: UnitConverter,
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, compress, and convert your PDF files with ease.',
    icon: <DocumentIcon className="w-12 h-12 text-blue-500" />,
    component: PdfTools,
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, secure, and random passwords.',
    icon: <LockIcon className="w-12 h-12 text-blue-500" />,
    component: PasswordGenerator,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform basic and percentage calculations quickly.',
    icon: <CalculatorIcon className="w-12 h-12 text-blue-500" />,
    component: Calculator,
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce the file size of your images without losing quality.',
    icon: <PhotoIcon className="w-12 h-12 text-blue-500" />,
    component: ImageCompressor,
  },
];
