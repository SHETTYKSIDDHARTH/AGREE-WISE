import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image as ImageIcon, X, Check } from 'lucide-react';
import { useUILanguage } from '../contexts/UILanguageContext';

export default function FileUpload({ onFileSelect, selectedFile }) {
  const { t } = useUILanguage();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.heic']
    },
    maxFiles: 1,
    maxSize: 10485760
  });

  const removeFile = (e) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-white" />;
    }
    return <ImageIcon className="w-6 h-6 text-white" />;
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-white bg-white bg-opacity-10'
              : 'border-white border-opacity-20 hover:border-opacity-40 hover:bg-white hover:bg-opacity-5'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-full mb-4 ${
              isDragActive ? 'bg-white' : 'bg-white bg-opacity-10'
            }`}>
              <Upload className={`w-8 h-8 ${
                isDragActive ? 'text-black' : 'text-white'
              }`} />
            </div>
            
            {isDragActive ? (
              <p className="text-base font-medium text-white">
                {t('dragActive')}
              </p>
            ) : (
              <div>
                <p className="text-base font-medium text-white mb-1">
                  {t('uploadPrompt')}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {t('uploadHint')}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-white border-opacity-20 rounded-lg p-5 bg-white bg-opacity-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-white bg-opacity-10 rounded border border-white border-opacity-20">
                {getFileIcon(selectedFile)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="font-medium text-sm text-white truncate">
                    {selectedFile.name}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            <button
              onClick={removeFile}
              className="p-1.5 hover:bg-white hover:bg-opacity-10 rounded transition-colors ml-2"
              aria-label={t('removeFile')}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}