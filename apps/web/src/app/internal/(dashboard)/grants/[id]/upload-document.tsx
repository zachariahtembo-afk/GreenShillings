'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  fileName: string;
  contentType: string;
  sizeBytes: number | null;
  uploadedAt: string;
}

interface AnalysisResult {
  fundingAmounts?: string[];
  deadlines?: string[];
  focusAreas?: string[];
  eligibilityCriteria?: string[];
  wordCount?: number;
  analyzedAt?: string;
}

function formatFileSize(bytes: number | null): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadDocument({
  proposalId,
  initialDocuments,
  analysisStatus: initialAnalysisStatus,
  analysisResult: initialAnalysisResult,
}: {
  proposalId: string;
  initialDocuments: Document[];
  analysisStatus: string | null;
  analysisResult: AnalysisResult | null;
}) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState(initialAnalysisStatus);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(initialAnalysisResult);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      // 1. Get presigned upload URL
      const res = await fetch(`/api/internal/grants/${proposalId}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          sizeBytes: file.size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get upload URL');
      }

      const { uploadUrl, document: doc } = await res.json();

      // 2. Upload file directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to storage');
      }

      setDocuments((prev) => [doc, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [proposalId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const triggerAnalysis = useCallback(async () => {
    setError(null);
    setAnalysisStatus('pending');

    try {
      const res = await fetch(`/api/internal/grants/${proposalId}/analyze`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to trigger analysis');
      }

      // Start polling for status
      pollingRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/internal/grants/${proposalId}/analyze/status`);
          const statusData = await statusRes.json();

          setAnalysisStatus(statusData.status);

          if (statusData.result) {
            setAnalysisResult(statusData.result);
          }

          if (statusData.status === 'completed' || statusData.status === 'failed') {
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        } catch {
          // Keep polling on transient errors
        }
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setAnalysisStatus(null);
    }
  }, [proposalId]);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-forest bg-forest/5'
            : 'border-forest/20 hover:border-forest/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = '';
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 text-forest animate-spin" />
            <p className="text-sm text-charcoal/60">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-forest/50" />
            <p className="text-sm text-charcoal/60">
              Drop a file here or click to upload
            </p>
            <p className="text-xs text-charcoal/40">PDF, Word, or text files</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg bg-chalk"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 h-9 w-9 rounded-lg bg-forest/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-forest" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{doc.title}</p>
                  <p className="text-xs text-charcoal/50">
                    {doc.fileName}
                    {doc.sizeBytes != null && <> &middot; {formatFileSize(doc.sizeBytes)}</>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analyze Button */}
      {documents.length > 0 && (
        <button
          onClick={triggerAnalysis}
          disabled={analysisStatus === 'pending' || analysisStatus === 'running'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analysisStatus === 'pending' || analysisStatus === 'running' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {analysisStatus === 'pending' ? 'Starting analysis...' : 'Analyzing...'}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze with Databricks
            </>
          )}
        </button>
      )}

      {/* Analysis Results */}
      {analysisStatus === 'completed' && analysisResult && (
        <div className="rounded-lg border border-forest/20 bg-forest/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-forest" />
            <h3 className="text-sm font-semibold text-forest">Analysis Complete</h3>
          </div>

          {analysisResult.focusAreas && analysisResult.focusAreas.length > 0 && (
            <div>
              <p className="text-xs font-medium text-charcoal/50 mb-1">Focus Areas</p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="text-xs bg-forest/10 text-forest px-2 py-0.5 rounded-full capitalize"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysisResult.fundingAmounts && analysisResult.fundingAmounts.length > 0 && (
            <div>
              <p className="text-xs font-medium text-charcoal/50 mb-1">Funding Amounts</p>
              <p className="text-sm text-charcoal">{analysisResult.fundingAmounts.join(', ')}</p>
            </div>
          )}

          {analysisResult.deadlines && analysisResult.deadlines.length > 0 && (
            <div>
              <p className="text-xs font-medium text-charcoal/50 mb-1">Deadlines</p>
              <p className="text-sm text-charcoal">{analysisResult.deadlines.join(', ')}</p>
            </div>
          )}

          {analysisResult.eligibilityCriteria && analysisResult.eligibilityCriteria.length > 0 && (
            <div>
              <p className="text-xs font-medium text-charcoal/50 mb-1">Eligibility Criteria</p>
              <ul className="text-sm text-charcoal space-y-1">
                {analysisResult.eligibilityCriteria.map((criteria, i) => (
                  <li key={i} className="text-sm text-charcoal/70">{criteria}</li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.wordCount && (
            <p className="text-xs text-charcoal/40">
              Document: {analysisResult.wordCount.toLocaleString()} words
            </p>
          )}
        </div>
      )}

      {analysisStatus === 'failed' && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Analysis failed. You can try again.
        </div>
      )}
    </div>
  );
}
