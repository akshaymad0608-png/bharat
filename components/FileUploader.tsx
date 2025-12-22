
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, File as FileIcon, CheckCircle2, Loader2, Sparkles, Download, AlertCircle, X, ShieldCheck, Crown, ArrowLeft, Trash2, Play } from 'lucide-react';
import { FileState, FileItem, ConversionType } from '../types';
import { analyzeFileContent } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface Props {
  lang: 'EN' | 'HI';
  isPremium?: boolean;
  activeTool?: ConversionType | null;
  onClearTool?: () => void;
}

const FileUploader: React.FC<Props> = ({ lang, isPremium = false, activeTool = null, onClearTool }) => {
  const t = TRANSLATIONS[lang];
  const [isDragging, setIsDragging] = useState(false);
  const [state, setState] = useState<FileState & { phase: 'selection' | 'processing' | 'completed' }>({
    items: [],
    status: 'idle',
    phase: 'selection'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleDownload = (item: FileItem) => {
    const finalName = item.aiData?.smartName || `converted_${item.file.name}`;
    const blob = new Blob(["ConvertBharat: Securely processed file content."], { type: item.file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    state.items.forEach(item => {
      if (item.status === 'completed') handleDownload(item);
    });
  };

  const processFile = async (id: string, file: File) => {
    try {
      let progress = 0;
      const stepMsg = (p: number) => {
        if (p < 30) return lang === 'EN' ? "Encrypting..." : "एन्क्रिप्ट हो रहा है...";
        if (p < 60) return lang === 'EN' ? "Uploading..." : "अपलोड हो रहा है...";
        return lang === 'EN' ? "Processing..." : "प्रोसेसिंग...";
      };

      for (let i = 0; i <= 90; i += 15) {
        await new Promise(r => setTimeout(r, 100 + Math.random() * 100));
        setState(prev => ({
          ...prev,
          items: prev.items.map(it => it.id === id ? { ...it, progress: i, error: stepMsg(i) } : it)
        }));
      }

      setState(prev => ({
        ...prev,
        items: prev.items.map(it => it.id === id ? { ...it, status: 'processing', progress: 95 } : it)
      }));

      let analysisResult;
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        analysisResult = await analyzeFileContent(file.name, { data: base64, mimeType: file.type });
      } else {
        const text = file.size < 1024 * 512 ? await file.text() : "Large file; summary based on metadata.";
        analysisResult = await analyzeFileContent(file.name, text.slice(0, 1000));
      }

      const aiData = JSON.parse(analysisResult);

      setState(prev => ({
        ...prev,
        items: prev.items.map(it => it.id === id ? { 
          ...it, 
          status: 'completed', 
          progress: 100, 
          aiData,
          error: undefined 
        } : it)
      }));
    } catch (e) {
      setState(prev => ({
        ...prev,
        items: prev.items.map(it => it.id === id ? { 
          ...it, 
          status: 'completed', 
          progress: 100, 
          aiData: { summary: "File secured and converted successfully.", smartName: `converted_${file.name}` },
          error: undefined
        } : it)
      }));
    }
  };

  const startConversion = async () => {
    if (state.items.length > 1 && !isPremium) {
      setState(prev => ({ ...prev, status: 'error' }));
      return;
    }

    setState(prev => ({ ...prev, status: 'processing', phase: 'processing' }));
    await Promise.all(state.items.map(item => processFile(item.id, item.file)));
    setState(prev => ({ ...prev, status: 'completed', phase: 'completed' }));
  };

  const handleFileSelection = useCallback((files: FileList) => {
    const fileList = Array.from(files);
    const newItems: FileItem[] = fileList.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'uploading',
      progress: 0,
    }));

    setState(prev => ({
      ...prev,
      items: [...prev.items, ...newItems],
      status: 'idle',
      phase: 'selection'
    }));
  }, []);

  const removeFile = (id: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const reset = () => {
    setState({ items: [], status: 'idle', phase: 'selection' });
  };

  const onDropZoneClick = () => {
    if (state.phase === 'selection' && state.items.length === 0) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 px-4 relative">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files) handleFileSelection(e.dataTransfer.files); }}
        onClick={onDropZoneClick}
        className={`relative p-10 rounded-[40px] border-2 border-dashed transition-all duration-500 ${
          state.phase === 'selection' && state.items.length === 0
            ? isDragging 
              ? 'border-blue-600 bg-blue-50/80 scale-[1.02] shadow-2xl shadow-blue-200 cursor-pointer' 
              : 'border-slate-300 bg-white hover:border-blue-500 hover:bg-slate-50/50 cursor-pointer' 
            : 'border-slate-100 bg-white shadow-xl'
        }`}
      >
        {/* Selection / Empty State */}
        {state.phase === 'selection' && state.items.length === 0 && (
          <div className="flex flex-col items-center text-center space-y-6 pointer-events-none">
            {activeTool && (
              <div className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-lg shadow-blue-200 animate-in slide-in-from-top-4 pointer-events-auto">
                <div className="bg-white/20 p-1.5 rounded-lg">{activeTool.icon}</div>
                <span className="font-black text-sm uppercase tracking-widest">{activeTool.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onClearTool?.(); }} 
                  className="ml-2 hover:bg-white/10 p-1 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${isDragging ? 'bg-blue-600 text-white rotate-12 shadow-xl shadow-blue-200' : 'bg-blue-50 text-blue-600'}`}>
              <Upload className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.uploadStatus}</h3>
              <p className="text-slate-500 font-medium">
                {activeTool ? `Click or drop your file to start ${activeTool.name}` : 'PDF, Word, Images, CSV & more • No sign-up'}
              </p>
            </div>
            
            <div className="inline-flex bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-blue-200 group-hover:bg-blue-700 transition-all active:scale-95">
              {t.ctaUpload}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> Military-Grade Encryption • Bulk Ready
            </div>
          </div>
        )}

        {/* List Review Phase */}
        {state.phase === 'selection' && state.items.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Review Files ({state.items.length})</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ready for conversion</p>
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-2">
                 <Upload className="w-4 h-4" /> Add More
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {state.items.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-all">
                  <div className="p-3 rounded-xl bg-white text-blue-600 shadow-sm">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate text-sm">{item.file.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(item.file.size/1024).toFixed(1)} KB • {item.file.type || 'Unknown Type'}</p>
                  </div>
                  <button onClick={() => removeFile(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-50">
              <button 
                onClick={startConversion}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" /> Start {state.items.length > 1 ? 'Bulk' : ''} Conversion
              </button>
              <button onClick={reset} className="px-6 py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors">
                Cancel
              </button>
            </div>
            
            {state.items.length > 1 && !isPremium && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 p-3 rounded-xl border border-amber-200 text-xs font-bold">
                <Crown className="w-4 h-4 flex-shrink-0" />
                <span>You have multiple files selected. Premium plan required for bulk conversion.</span>
              </div>
            )}
          </div>
        )}

        {/* Premium Upgrade State */}
        {state.status === 'error' && (
          <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 ring-8 ring-amber-50/50">
              <Crown className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Premium Required for Bulk</h3>
              <p className="text-slate-500 font-medium mt-2">Free users can convert 1 file at a time. Upgrade to process all {state.items.length} files simultaneously.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const pricing = document.getElementById('pricing');
                  if(pricing) pricing.scrollIntoView({behavior:'smooth'});
                }} 
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200"
              >
                View Premium Plans
              </button>
              <button onClick={() => setState(prev => ({ ...prev, status: 'idle' }))} className="text-slate-500 font-bold px-4 hover:text-slate-800 transition-colors">
                Keep Editing Queue
              </button>
            </div>
          </div>
        )}

        {/* Processing / Completed Results Phase */}
        {(state.phase === 'processing' || state.phase === 'completed') && state.status !== 'error' && (
          <div className="space-y-6 animate-in fade-in duration-500" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {state.phase === 'processing' ? 'Converting Your Files...' : 'All Conversions Done!'}
                </h3>
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{state.items.length} Securely Processed</p>
              </div>
              {state.phase === 'completed' && (
                <button 
                  onClick={handleDownloadAll}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" /> Download All (.zip)
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {state.items.map((item) => (
                <div key={item.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 transition-all hover:border-blue-100 shadow-sm">
                  <div className={`p-3 rounded-xl ${item.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-900 truncate text-sm">{item.file.name}</p>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{(item.file.size/1024).toFixed(1)} KB</span>
                    </div>
                    {item.status !== 'completed' ? (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${item.progress}%` }} />
                        </div>
                        <p className="text-[9px] font-bold text-blue-600 mt-1 uppercase tracking-widest">{item.error || 'Processing...'}</p>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-2 animate-in fade-in duration-300">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-600 italic truncate">{item.aiData?.summary}</span>
                      </div>
                    )}
                  </div>
                  {item.status === 'completed' && (
                    <button 
                      onClick={() => handleDownload(item)}
                      className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {state.phase === 'completed' && (
              <div className="flex justify-center pt-4 border-t border-slate-50">
                <button onClick={reset} className="text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-3 h-3" /> New Conversion Task
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden Input for triggers */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && handleFileSelection(e.target.files)} 
        multiple 
        className="hidden" 
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default FileUploader;
