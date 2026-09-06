import { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { X, Upload, Image, Film, Music, File, Check } from 'lucide-react';

export default function ImportModal() {
  const { setShowImportModal, addMediaFile, addClip, tracks } = useStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [importedFiles, setImportedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setImportedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImportedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const getFileType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'audio';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={16} className="text-orange-400" />;
      case 'video': return <Film size={16} className="text-blue-400" />;
      case 'audio': return <Music size={16} className="text-yellow-400" />;
      default: return <File size={16} className="text-gray-400" />;
    }
  };

  const handleImport = () => {
    importedFiles.forEach(file => {
      const type = getFileType(file);
      const url = URL.createObjectURL(file);
      addMediaFile({
        id: `media-${Date.now()}-${Math.random()}`,
        name: file.name,
        type,
        src: url,
        size: file.size,
        format: file.type,
        favorite: false,
        createdAt: new Date().toISOString(),
      });

      // Add to first matching track
      const track = tracks.find(t => t.type === type);
      if (track) {
        addClip(track.id, {
          name: file.name,
          type,
          src: url,
          startTime: 0,
          duration: type === 'image' ? 5 : 10,
        });
      }
    });
    setShowImportModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[520px] rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-lg font-bold">Import Media</h2>
            <p className="text-xs text-gray-500 mt-0.5">Drag and drop or browse files</p>
          </div>
          <button className="tool-btn" onClick={() => setShowImportModal(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
              isDragOver 
                ? 'border-[var(--accent)] bg-[var(--accent)]/10' 
                : 'border-gray-700 hover:border-gray-600 hover:bg-[var(--bg-tertiary)]'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto mb-3 text-gray-500" />
            <p className="text-sm text-gray-400 mb-1">Drop files here or click to browse</p>
            <p className="text-xs text-gray-600">
              Images: JPG, PNG, WEBP, SVG • Video: MP4, MOV, WEBM • Audio: MP3, WAV, AAC
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.svg,.mp4,.mov,.webm,.mkv,.mp3,.wav,.aac,.m4a,.ogg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Imported files list */}
          {importedFiles.length > 0 && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {importedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  {getFileIcon(getFileType(file))}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate">{file.name}</div>
                    <div className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                  </div>
                  <Check size={14} className="text-green-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <button className="btn btn-secondary px-6" onClick={() => setShowImportModal(false)}>
            Cancel
          </button>
          <button 
            className="btn btn-primary px-6" 
            onClick={handleImport}
            disabled={importedFiles.length === 0}
          >
            <Upload size={14} /> Import {importedFiles.length > 0 ? `(${importedFiles.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
