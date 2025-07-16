import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FileUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.name.toLowerCase().endsWith('.xml')) {
      setError('Alleen XML bestanden zijn toegestaan');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        onUploadSuccess(result);
      } else {
        setError(result.error || 'Er is een fout opgetreden bij het uploaden');
      }
    } catch (err) {
      setError('Netwerkfout: Kan geen verbinding maken met de server');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          XML Bestand Uploaden
        </CardTitle>
        <CardDescription>
          Upload uw rittenadministratie XML bestand om de data te bekijken en te converteren
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">
            Sleep uw XML bestand hierheen
          </p>
          <p className="text-gray-500 mb-4">of</p>
          <Button
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById('file-input').click()}
          >
            {isUploading ? 'Uploaden...' : 'Selecteer Bestand'}
          </Button>
          <input
            id="file-input"
            type="file"
            accept=".xml"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-4">
            Alleen XML bestanden zijn toegestaan
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;

