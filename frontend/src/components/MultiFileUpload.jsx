import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image as ImageIcon, X, GripVertical } from 'lucide-react';
import { useUILanguage } from '../contexts/UILanguageContext';

export default function MultiFileUpload({ onFilesSelect, selectedFiles }) {
  const { t } = useUILanguage();
  const [draggedIndex, setDraggedIndex] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      // Add new files to existing ones
      const newFiles = [...(selectedFiles || []), ...acceptedFiles];
      onFilesSelect(newFiles);
    }
  }, [selectedFiles, onFilesSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/*': ['.png', '.jpg', '.jpeg', '.heic']
    },
    multiple: true,
    maxFiles: 20,
    maxSize: 10485760 // 10MB per file
  });

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelect(newFiles.length > 0 ? newFiles : null);
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
      return <FileText className="w-5 h-5 text-white" />;
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword') {
      return <FileText className="w-5 h-5 text-white" />;
    }
    return <ImageIcon className="w-5 h-5 text-white" />;
  };

  const isImage = (file) => {
    return file.type.startsWith('image/');
  };

  // Drag and drop reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex === null || draggedIndex === index) return;

    const newFiles = [...selectedFiles];
    const draggedFile = newFiles[draggedIndex];

    // Remove from old position
    newFiles.splice(draggedIndex, 1);
    // Insert at new position
    newFiles.splice(index, 0, draggedFile);

    onFilesSelect(newFiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const [imagePreviews, setImagePreviews] = useState({});

  // Generate image previews
  const generatePreview = (file, index) => {
    if (isImage(file) && !imagePreviews[index]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, [index]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      {(!selectedFiles || selectedFiles.length === 0) ? (
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
                <p className="text-sm text-gray-400 mb-2">
                  {t('uploadHint')}
                </p>
                <p className="text-xs text-gray-500">
                  Multiple images? Upload them all at once!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* File List */}
          <div className="border border-white border-opacity-20 rounded-lg bg-white bg-opacity-5">
            {/* Header */}
            <div className="p-4 border-b border-white border-opacity-10 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  {selectedFiles.length === 1 ? 'Selected File' : `${selectedFiles.length} Pages`}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedFiles.length > 1 && 'Drag to reorder pages'}
                </p>
              </div>
              <button
                onClick={() => onFilesSelect(null)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Files */}
            <div className="divide-y divide-white divide-opacity-10">
              {selectedFiles.map((file, index) => {
                generatePreview(file, index);

                return (
                  <div
                    key={`${file.name}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 hover:bg-white hover:bg-opacity-5 transition-all cursor-move ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Drag Handle */}
                      <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />

                      {/* Page Number */}
                      <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-10 rounded border border-white border-opacity-20 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{index + 1}</span>
                      </div>

                      {/* Preview or Icon */}
                      {isImage(file) && imagePreviews[index] ? (
                        <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-10 rounded border border-white border-opacity-20 overflow-hidden">
                          <img
                            src={imagePreviews[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 p-2 bg-white bg-opacity-10 rounded border border-white border-opacity-20">
                          {getFileIcon(file)}
                        </div>
                      )}

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-white truncate">
                          Page {index + 1}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {file.name} • {formatFileSize(file.size)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1.5 hover:bg-white hover:bg-opacity-10 rounded transition-colors flex-shrink-0"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add More Button */}
            <div
              {...getRootProps()}
              className="p-4 border-t border-white border-opacity-10 cursor-pointer hover:bg-white hover:bg-opacity-5 transition-all"
            >
              <input {...getInputProps()} />
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white">
                <Upload className="w-4 h-4" />
                <span>Add More Pages</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
