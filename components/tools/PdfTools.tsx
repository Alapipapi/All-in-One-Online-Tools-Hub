import React, { useState, useCallback } from 'react';

// Declare external libraries to be available in the global scope
declare const PDFLib: any;
declare const pdfjsLib: any;
declare const JSZip: any;

// Helper function to format file size
const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Reusable file input component with drag-and-drop support
const PdfFileDropzone = ({ onFileSelect, id = "pdf-file-input" }: { onFileSelect: (file: File) => void, id?: string }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent) => {
        handleDrag(e);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragOut = (e: React.DragEvent) => {
        handleDrag(e);
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        handleDrag(e);
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                onFileSelect(droppedFile);
            } else {
                alert('Please drop a valid PDF file.');
            }
            e.dataTransfer.clearData();
        }
    };

    return (
        <div onDragEnter={handleDragIn} onDragOver={handleDrag} onDragLeave={handleDragOut} onDrop={handleDrop}>
            <label 
                htmlFor={id} 
                className={`w-full bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed py-8 text-center transition cursor-pointer block ${
                    isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' 
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
                <span className="font-semibold text-gray-600 dark:text-gray-300">Click or Drop PDF file here</span>
            </label>
            <input 
                id={id}
                key={Date.now()}
                type="file" 
                accept=".pdf" 
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        onFileSelect(e.target.files[0])
                    }
                }} 
                className="hidden"
            />
        </div>
    );
};


// Loading spinner component
const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const PdfTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'merge' | 'compress' | 'convert' | null>(null);

  const ToolButton = ({ name, icon, onClick }: { name: string; icon: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-blue-400 transition text-gray-600 dark:text-gray-300">
      {icon}
      <span className="mt-2 font-semibold">{name}</span>
    </button>
  );
  
  const ToolSelection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <ToolButton 
          name="Merge PDF" 
          onClick={() => setActiveTool('merge')}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
      />
      <ToolButton 
          name="Compress PDF"
          onClick={() => setActiveTool('compress')} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>}
      />
      <ToolButton 
          name="Convert PDF" 
          onClick={() => setActiveTool('convert')}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
      />
    </div>
  );

  const MergeTool = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [inputKey, setInputKey] = useState(Date.now());
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = event.target.files;
      if (newFiles && newFiles.length > 0) {
        const pdfFiles = Array.from(newFiles).filter((file: File) => file.type === 'application/pdf');
        setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
      }
      setInputKey(Date.now());
    };
    
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent) => {
        handleDrag(e);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragOut = (e: React.DragEvent) => {
        handleDrag(e);
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        handleDrag(e);
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type === 'application/pdf');
            if (droppedFiles.length > 0) {
                setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
            } else {
                 alert('Please drop valid PDF files.');
            }
            e.dataTransfer.clearData();
        }
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
      const newFiles = [...files];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < files.length) {
        [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
        setFiles(newFiles);
      }
    };

    const removeFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    const handleMerge = async () => {
      if (files.length < 2) {
        alert("Please select at least two PDF files to merge.");
        return;
      }
      setIsMerging(true);
      try {
        const { PDFDocument } = PDFLib;
        const mergedPdfDoc = await PDFDocument.create();
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
        }
        const mergedPdfBytes = await mergedPdfDoc.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'merged-document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setFiles([]);
      } catch (err) {
        console.error(err);
        alert('An error occurred. Make sure files are not corrupted or password-protected.');
      } finally {
        setIsMerging(false);
      }
    };

    return (
      <div className="text-left space-y-4">
        <div onDragEnter={handleDragIn} onDragOver={handleDrag} onDragLeave={handleDragOut} onDrop={handleDrop}>
           <label 
             htmlFor="pdf-merger-input" 
             className={`w-full bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed py-8 text-center transition cursor-pointer block ${
                isDragging 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' 
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
             }`}
           >
             <span className="font-semibold text-gray-600 dark:text-gray-300">Click or Drop PDF files to add</span>
           </label>
           <input id="pdf-merger-input" key={inputKey} type="file" multiple accept=".pdf" onChange={handleFileChange} className="hidden" />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Files to merge ({files.length}):</h3>
            <ul className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="p-3 flex justify-between items-center bg-white dark:bg-gray-800">
                  <span className="truncate pr-2 text-gray-700 dark:text-gray-300">{index + 1}. {file.name}</span>
                  <div className="flex items-center space-x-2 flex-shrink-0 text-gray-500 dark:text-gray-400">
                    <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="disabled:opacity-25 disabled:cursor-not-allowed p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" transform="rotate(90 10 10)" /></svg>
                    </button>
                    <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="disabled:opacity-25 disabled:cursor-not-allowed p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" transform="rotate(-90 10 10)" /></svg>
                    </button>
                    <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <button onClick={handleMerge} disabled={files.length < 2 || isMerging} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            {isMerging ? <><Spinner /> Merging...</> : `Merge ${files.length > 0 ? files.length : ''} Files`}
          </button>
          <button onClick={() => setActiveTool(null)} className="w-full sm:w-auto bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Back</button>
        </div>
      </div>
    );
  };

  const CompressTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [quality, setQuality] = useState(0.7);
    const [compressedSize, setCompressedSize] = useState(0);
    const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

    const resetState = () => {
      setFile(null);
      setIsCompressing(false);
      setCompressedSize(0);
      setCompressedUrl(null);
    };

    const handleCompress = async () => {
      if (!file) return;
      setIsCompressing(true);
      setCompressedUrl(null);
      setCompressedSize(0);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const { PDFDocument } = PDFLib;
        const newPdfDoc = await PDFDocument.create();

        for (let i = 0; i < pdfJsDoc.numPages; i++) {
          const page = await pdfJsDoc.getPage(i + 1);
          const viewport = page.getViewport({ scale: 1.5 }); // Render at 150% to maintain clarity
          
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext('2d');
          if (!context) {
              console.error("Could not get canvas context");
              continue;
          }
          
          await page.render({ canvasContext: context, viewport }).promise;

          const imageBlob = await new Promise<Blob | null>(resolve => {
              canvas.toBlob(blob => {
                  resolve(blob);
              }, 'image/jpeg', quality);
          });
          
          if (!imageBlob) {
              console.error(`Failed to create blob for page ${i + 1}`);
              continue;
          }

          const imageBytes = await imageBlob.arrayBuffer();
          const image = await newPdfDoc.embedJpg(imageBytes);
          const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
          newPage.drawImage(image, { x: 0, y: 0, width: viewport.width, height: viewport.height });
        }

        const pdfBytes = await newPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setCompressedSize(blob.size);
        setCompressedUrl(URL.createObjectURL(blob));

      } catch (err) {
        console.error(err);
        alert('An error occurred during compression.');
      } finally {
        setIsCompressing(false);
      }
    };
    
    return (
        <div className="text-left space-y-4">
            {!file ? (
                <PdfFileDropzone onFileSelect={setFile} id="pdf-compress-input" />
            ) : (
                <div className="space-y-4">
                     <div className="p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg">
                        <p className="font-semibold truncate">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Original Size: {formatSize(file.size)}</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="quality" className="font-medium">Compression Quality: <span className="text-blue-600 dark:text-blue-400 font-bold">{(quality * 100).toFixed(0)}%</span></label>
                        <input id="quality" type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full" />
                    </div>

                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
                        <b>Note:</b> This process converts pages to images to reduce size, which means text will not be selectable in the compressed file.
                    </div>
                    
                    {compressedUrl && file && (() => {
                        const sizeDifference = file.size - compressedSize;
                        const percentageChange = Math.abs((sizeDifference / file.size) * 100);
                        const isReduction = sizeDifference > 0;

                        return (
                            <div className={`p-3 border-l-4 rounded-lg ${isReduction 
                                ? "bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-700 text-green-700 dark:text-green-300" 
                                : "bg-red-100 dark:bg-red-900/50 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300"}`}>
                                <p className="font-bold">Compression Complete!</p>
                                <p>
                                    New size: {formatSize(compressedSize)} ({percentageChange.toFixed(1)}% {isReduction ? 'reduction' : 'increase'})
                                </p>
                            </div>
                        );
                    })()}
                    
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                         <button onClick={handleCompress} disabled={isCompressing} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                            {isCompressing ? <><Spinner /> Compressing...</> : 'Compress PDF'}
                         </button>
                         {compressedUrl && <a href={compressedUrl} download={`compressed-${file.name}`} className="w-full sm:w-auto text-center whitespace-nowrap bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center">Download</a>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={resetState} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Compress Another</button>
                    </div>
                </div>
            )}
        </div>
    );
  };
  
  const ConvertTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState('');
    const [zipUrl, setZipUrl] = useState<string | null>(null);

    const resetState = () => {
        setFile(null);
        setIsConverting(false);
        setProgress('');
        if(zipUrl) URL.revokeObjectURL(zipUrl);
        setZipUrl(null);
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsConverting(true);
        setProgress('Starting conversion...');
        setZipUrl(null);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const zip = new JSZip();
            
            for (let i = 0; i < pdfJsDoc.numPages; i++) {
                setProgress(`Processing page ${i + 1} of ${pdfJsDoc.numPages}...`);
                const page = await pdfJsDoc.getPage(i + 1);
                const viewport = page.getViewport({ scale: 1.5 }); // High-quality output
                
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');
                if (!context) {
                    console.error(`Could not get canvas context for page ${i + 1}`);
                    continue;
                }

                await page.render({ canvasContext: context, viewport }).promise;
                
                const imageBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
                if(imageBlob) {
                    zip.file(`page_${i + 1}.jpg`, imageBlob);
                }
            }

            setProgress('Generating ZIP file...');
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            setZipUrl(URL.createObjectURL(zipBlob));
            setProgress('Conversion complete! Your download is ready.');

        } catch (err) {
            console.error(err);
            alert('An error occurred during conversion.');
            setProgress('An error occurred. Please try again.');
        } finally {
            setIsConverting(false);
        }
    };
    
    return (
        <div className="text-left space-y-4">
            {!file ? (
                <PdfFileDropzone onFileSelect={setFile} id="pdf-convert-input" />
            ) : (
                <div className="space-y-4">
                    <div className="p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg">
                        <p className="font-semibold truncate">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Size: {formatSize(file.size)}</p>
                    </div>

                     <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button onClick={handleConvert} disabled={isConverting} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                           {isConverting ? <><Spinner /> Converting...</> : 'Convert PDF to JPG'}
                        </button>
                        {zipUrl && <a href={zipUrl} download={`${file.name.replace('.pdf', '')}.zip`} className="w-full sm:w-auto text-center whitespace-nowrap bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center">Download ZIP</a>}
                    </div>

                    {(progress) && (
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                            <p className="font-semibold text-gray-700 dark:text-gray-200">{progress}</p>
                        </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={resetState} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Convert Another</button>
                    </div>
                </div>
            )}
        </div>
    );
  };
  
  return (
    <div className="text-center">
      {!activeTool && <ToolSelection />}
      {activeTool === 'merge' && <MergeTool />}
      {activeTool === 'compress' && <CompressTool />}
      {activeTool === 'convert' && <ConvertTool />}
    </div>
  );
};

export default PdfTools;