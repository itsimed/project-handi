import { useState, useRef } from 'react';
import { DocumentIcon, CloseIcon } from './icons';

interface FileUploadProps {
  applicationId: number;
  documentType: 'CV' | 'COVER_LETTER';
  existingDocument?: {
    id: number;
    fileName: string;
    fileSize: number;
  } | null;
  onUploadSuccess: (document: any) => void;
  onDelete?: (documentId: number) => void;
  label: string;
  accept?: string;
}

export const FileUpload = ({
  applicationId,
  documentType,
  existingDocument,
  onUploadSuccess,
  onDelete,
  label,
  accept = '.pdf,.doc,.docx',
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setError('');

    // Validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError('Fichier trop volumineux (max 5MB)');
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Type de fichier non autorisé (PDF, DOC, DOCX uniquement)');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('applicationId', applicationId.toString());
      formData.append('documentType', documentType);

      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:4000/api/v1/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      onUploadSuccess(data.document);
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingDocument || !onDelete) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    onDelete(existingDocument.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>

      {existingDocument ? (
        <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <DocumentIcon size={24} className="text-purple-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">
                {existingDocument.fileName}
              </p>
              <p className="text-xs text-slate-400">
                {formatFileSize(existingDocument.fileSize)}
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
            aria-label="Supprimer le document"
          >
            <CloseIcon size={20} />
          </button>
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-all duration-200
              ${dragOver 
                ? 'border-purple-400 bg-purple-400/10' 
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileSelect(selectedFile);
              }}
              className="hidden"
              aria-label={`Sélectionner ${label}`}
            />

            <DocumentIcon size={40} className="mx-auto mb-3 text-slate-500" />
            
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-200">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-slate-300">
                  Glissez-déposez ou cliquez pour sélectionner
                </p>
                <p className="text-xs text-slate-500">
                  PDF, DOC, DOCX (max 5MB)
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          {file && !error && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`
                w-full py-2 px-4 rounded-lg font-medium transition-all
                ${uploading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
                }
              `}
            >
              {uploading ? 'Upload en cours...' : 'Uploader'}
            </button>
          )}
        </>
      )}
    </div>
  );
};
