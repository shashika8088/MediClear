import React, { useCallback, useState } from 'react';
import { InputMode } from '../types';
import { UploadIcon, FileTextIcon } from './Icons';

interface ReportInputProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ReportInput: React.FC<ReportInputProps> = ({
  inputMode,
  setInputMode,
  textInput,
  setTextInput,
  selectedImage,
  setSelectedImage,
  onAnalyze,
  isLoading
}) => {

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
            setInputMode(InputMode.IMAGE);
        };
        reader.readAsDataURL(file);
    }
  }, [setInputMode, setSelectedImage]);

  const isAnalyzeDisabled = (inputMode === InputMode.TEXT && !textInput.trim()) ||
                            (inputMode === InputMode.IMAGE && !selectedImage) ||
                            isLoading;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden no-print">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setInputMode(InputMode.TEXT)}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors duration-200 ${
            inputMode === InputMode.TEXT
              ? 'text-medical-700 border-b-2 border-medical-600 bg-medical-50/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => setInputMode(InputMode.IMAGE)}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors duration-200 ${
            inputMode === InputMode.IMAGE
              ? 'text-medical-700 border-b-2 border-medical-600 bg-medical-50/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Upload Image / Screenshot
        </button>
      </div>

      <div className="p-6">
        {inputMode === InputMode.TEXT ? (
          <div className="space-y-4">
            <label htmlFor="medical-text" className="block text-sm font-medium text-slate-700">
              Copy and paste your report text below:
            </label>
            <textarea
              id="medical-text"
              rows={10}
              className="w-full p-4 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none transition-all resize-none"
              placeholder="e.g., 'Patient presented with acute bronchitis. Prescribed amoxicillin 500mg...'"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
        ) : (
          <div 
            className="space-y-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
             <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload a clear photo or screenshot of your report:
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${selectedImage ? 'border-medical-500 bg-medical-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
              >
                {selectedImage ? (
                  <div className="relative w-full h-full p-2">
                    <img 
                      src={selectedImage} 
                      alt="Uploaded report" 
                      className="w-full h-full object-contain rounded-md" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                        <p className="text-white font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="text-slate-400 mb-3">
                         <UploadIcon />
                    </div>
                    <p className="mb-2 text-sm text-slate-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG or GIF (MAX. 5MB)</p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-xs text-slate-500 text-center">
                For PDF reports, please take a screenshot or copy the text.
            </p>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={onAnalyze}
            disabled={isAnalyzeDisabled}
            className={`w-full flex items-center justify-center px-6 py-3.5 text-base font-medium text-white rounded-lg shadow-sm transition-all duration-200 ${
              isAnalyzeDisabled
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-medical-600 hover:bg-medical-700 active:transform active:scale-[0.99] shadow-medical-200 hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                Analyzing Report...
              </>
            ) : (
              <>
                <span className="mr-2">Simplify Report</span>
                <FileTextIcon />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportInput;
