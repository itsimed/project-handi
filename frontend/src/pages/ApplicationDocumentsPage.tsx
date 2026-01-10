import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { FileUpload } from '../components/FileUpload';
import apiClient from '../api/apiClient';
import { toastService } from '../services/toastService';
import type { ApplicationDocument } from '../types';

export const ApplicationDocumentsPage = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [applicationId]);

  const loadDocuments = async () => {
    try {
      const response = await apiClient.get(`/documents/application/${applicationId}`);
      setDocuments(response.data);
    } catch (error: any) {
      toastService.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (document: ApplicationDocument) => {
    toastService.success('Document uploadé avec succès');
    loadDocuments();
  };

  const handleDelete = async (documentId: number) => {
    try {
      await apiClient.delete(`/documents/${documentId}`);
      toastService.success('Document supprimé');
      loadDocuments();
    } catch (error: any) {
      toastService.error('Erreur lors de la suppression');
    }
  };

  const cvDocument = documents.find(d => d.documentType === 'CV');
  const coverLetterDocument = documents.find(d => d.documentType === 'COVER_LETTER');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <Breadcrumb />
        
        <div className="max-w-2xl mx-auto mt-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Documents de candidature
          </h1>

          {loading ? (
            <p className="text-slate-400">Chargement...</p>
          ) : (
            <div className="space-y-6">
              <FileUpload
                applicationId={parseInt(applicationId!)}
                documentType="CV"
                existingDocument={cvDocument}
                onUploadSuccess={handleUploadSuccess}
                onDelete={handleDelete}
                label="CV"
              />

              <FileUpload
                applicationId={parseInt(applicationId!)}
                documentType="COVER_LETTER"
                existingDocument={coverLetterDocument}
                onUploadSuccess={handleUploadSuccess}
                onDelete={handleDelete}
                label="Lettre de motivation"
              />

              <button
                onClick={() => navigate('/mes-candidatures')}
                className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Retour aux candidatures
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
