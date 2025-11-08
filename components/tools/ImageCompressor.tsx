import React, { useState, useCallback, useRef } from 'react';

const ImageCompressor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [quality, setQuality] = useState(0.7);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [fileName, setFileName] = useState('compressed-image.jpg');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setOriginalSize(file.size);
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalImage(e.target?.result as string);
                compressImage(e.target?.result as string, quality);
            };
            reader.readAsDataURL(file);
        }
    };

    const compressImage = useCallback((imageDataUrl: string, imageQuality: number) => {
        const img = new Image();
        img.src = imageDataUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const compressedUrl = URL.createObjectURL(blob);
                    setCompressedImage(compressedUrl);
                    setCompressedSize(blob.size);
                }
            }, 'image/jpeg', imageQuality);
        };
    }, []);

    const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuality = parseFloat(e.target.value);
        setQuality(newQuality);
        if (originalImage) {
            compressImage(originalImage, newQuality);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div>
            {!originalImage ? (
                <div 
                    className="flex justify-center items-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <p className="mt-2 font-semibold">Click to upload an image</p>
                        <p className="text-sm">PNG, JPG, GIF, etc.</p>
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center">
                            <h3 className="font-bold mb-2">Original ({formatSize(originalSize)})</h3>
                            <img src={originalImage} alt="Original" className="max-w-full max-h-64 mx-auto rounded-lg shadow-md" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold mb-2">Compressed ({formatSize(compressedSize)})</h3>
                            {compressedImage && <img src={compressedImage} alt="Compressed" className="max-w-full max-h-64 mx-auto rounded-lg shadow-md" />}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="quality" className="font-medium">Quality: <span className="text-blue-600 dark:text-blue-400 font-bold">{(quality * 100).toFixed(0)}%</span></label>
                        <input id="quality" type="range" min="0.1" max="1" step="0.05" value={quality} onChange={handleQualityChange} className="w-full" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                      <a
                          href={compressedImage || ''}
                          download={fileName}
                          className={`w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition ${!compressedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                          Download Compressed Image
                      </a>
                      <button onClick={() => { setOriginalImage(null); setCompressedImage(null); }} className="w-full sm:w-auto whitespace-nowrap bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                          Compress Another
                      </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCompressor;