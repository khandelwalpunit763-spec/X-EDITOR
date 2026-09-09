import { useEffect, useRef, useState } from 'react';
import { useCaptionStore, captionsToSRT, captionsToVTT, type CaptionStyle } from '../../store/captionStore';
import { useStore } from '../../store/useStore';
import { X, Mic, MicOff, Download, Copy, Trash2, Plus, Captions, AlertTriangle, Check } from 'lucide-react';

const LANGS = [
  { code: 'hi-IN', label: 'Hindi (हिन्दी)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'pa-IN', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'es-ES', label: 'Spanish' },
];

const STYLE_PRESETS: { id: CaptionStyle; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'bold', label: 'Dark Box' },
  { id: 'box', label: 'Neon Box' },
  { id: 'yellow', label: 'Yellow Pop' },
  { id: 'clean', label: 'Clean' },
];

const fmt = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1);
  return `${m}:${s.padStart(4, '0')}`;
};

export default function CaptionsModal() {
  const { captions, style, enabled, fontSize, addCaption, updateCaption, removeCaption, clearCaptions, setStyle, setEnabled, setFontSize } = useCaptionStore();
  const { setShowCaptionsModal } = useStore();

  const [lang, setLang] = useState('hi-IN');
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [newText, setNewText] = useState('');

  const recRef = useRef<any>(null);
  const startTimeRef = useRef(0);
  const segStartRef = useRef(0);
  const recordingRef = useRef(false);

  const SR = typeof window !== 'undefined'
    ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    : null;

  const close = () => {
    stopRecording();
    setShowCaptionsModal(false);
  };

  const stopRecording = () => {
    recordingRef.current = false;
    setRecording(false);
    setInterim('');
    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
  };

  const startRecording = () => {
    if (!SR) {
      setError('Aapka browser speech recognition support nahi karta. Chrome ya Edge use karein, ya neeche manually captions add karein.');
      return;
    }
    setError('');
    try {
      const rec = new SR();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;

      if (!recordingRef.current) {
        // fresh session — continue timeline from last caption
        const last = captions[captions.length - 1];
        segStartRef.current = last ? last.end : 0;
        startTimeRef.current = performance.now() / 1000 - segStartRef.current;
      }

      rec.onresult = (event: any) => {
        const now = performance.now() / 1000 - startTimeRef.current;
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0].transcript.trim();
          if (!text) continue;
          if (res.isFinal) {
            addCaption({ start: segStartRef.current, end: Math.max(now, segStartRef.current + 0.5), text });
            segStartRef.current = now;
            setInterim('');
          } else {
            interimText += text + ' ';
          }
        }
        if (interimText) setInterim(interimText);
      };

      rec.onerror = (e: any) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setError('Microphone permission chahiye. Browser settings me mic allow karein.');
          stopRecording();
        } else if (e.error === 'no-speech') {
          // ignore — continue listening
        } else if (e.error !== 'aborted') {
          setError('Speech recognition error: ' + e.error);
        }
      };

      rec.onend = () => {
        // Chrome auto-stops after silence — restart if still recording
        if (recordingRef.current) {
          try { rec.start(); } catch {}
        }
      };

      recRef.current = rec;
      rec.start();
      recordingRef.current = true;
      setRecording(true);
    } catch (e) {
      setError('Recording start nahi ho payi. Microphone check karein.');
    }
  };

  useEffect(() => () => { recordingRef.current = false; try { recRef.current?.stop(); } catch {} }, []);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = async () => {
    const text = captions.map(c => `[${fmt(c.start)}] ${c.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const addManual = () => {
    if (!newText.trim()) return;
    const last = captions[captions.length - 1];
    const start = last ? last.end : 0;
    addCaption({ start, end: start + 2.5, text: newText.trim() });
    setNewText('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={close} />

      <div className="relative w-full max-w-2xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,229,199,0.12)', color: 'var(--accent)' }}>
              <Captions size={16} />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white leading-none">AI Auto-Captions</h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Bolo — subtitles khud ban jayenge</p>
            </div>
          </div>
          <button onClick={close} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] text-gray-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-5 space-y-6">
          {/* ===== Recorder ===== */}
          <div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <select value={lang} onChange={e => setLang(e.target.value)} className="input flex-1" disabled={recording}>
                {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
              {!recording ? (
                <button onClick={startRecording} className="btn btn-primary px-5">
                  <Mic size={15} /> Start Recording
                </button>
              ) : (
                <button onClick={stopRecording} className="btn px-5" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)' }}>
                  <span className="rec-dot w-2 h-2 rounded-full bg-red-500 inline-block" />
                  <MicOff size={15} /> Stop
                </button>
              )}
            </div>

            {recording && (
              <div className="mt-3 px-3.5 py-3 rounded-xl text-sm animate-fade-in"
                style={{ background: 'rgba(0,229,199,0.06)', border: '1px solid rgba(0,229,199,0.2)' }}>
                <span className="text-[var(--text-muted)] text-xs block mb-1">Sun rahe hain…</span>
                <span className="text-white">{interim || '…'}</span>
              </div>
            )}

            {error && (
              <div className="mt-3 flex items-start gap-2 text-xs text-amber-300 px-3.5 py-3 rounded-xl"
                style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}>
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!SR && (
              <p className="mt-2 text-[11px] text-[var(--text-muted)]">
                💡 Tip: Voice captions ke liye Chrome/Edge best hai. Neeche manually bhi add kar sakte ho.
              </p>
            )}
          </div>

          {/* ===== Style presets ===== */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2.5">Caption style</div>
            <div className="flex flex-wrap gap-2">
              {STYLE_PRESETS.map(p => (
                <button key={p.id} onClick={() => setStyle(p.id)}
                  className="rounded-xl px-3 py-2.5 transition-all"
                  style={{
                    background: style === p.id ? 'rgba(0,229,199,0.1)' : 'var(--bg-tertiary)',
                    border: style === p.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                  }}>
                  <div className="h-10 flex items-center justify-center px-2" style={{ background: 'linear-gradient(135deg, #1a2f2b, #0e1518)', borderRadius: 8 }}>
                    <span className={`cap-base cap-${p.id}`} style={{ fontSize: 11 }}>Aa Style</span>
                  </div>
                  <div className={`text-[10px] mt-1.5 font-semibold ${style === p.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{p.label}</div>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
              <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#00e5c7]" />
                Canvas pe dikhao
              </label>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                Size
                <input type="range" min="0.6" max="1.8" step="0.1" value={fontSize}
                  onChange={e => setFontSize(parseFloat(e.target.value))} className="slider w-24" />
              </div>
            </div>
          </div>

          {/* ===== Caption list ===== */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Captions ({captions.length})
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={copyText} disabled={!captions.length} className="btn btn-ghost text-[11px] px-2 py-1 disabled:opacity-40">
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />} Copy
                </button>
                <button onClick={() => downloadFile(captionsToSRT(captions), 'captions.srt', 'text/plain')} disabled={!captions.length}
                  className="btn btn-ghost text-[11px] px-2 py-1 disabled:opacity-40">
                  <Download size={12} /> SRT
                </button>
                <button onClick={() => downloadFile(captionsToVTT(captions), 'captions.vtt', 'text/vtt')} disabled={!captions.length}
                  className="btn btn-ghost text-[11px] px-2 py-1 disabled:opacity-40">
                  <Download size={12} /> VTT
                </button>
                <button onClick={clearCaptions} disabled={!captions.length} className="btn btn-ghost text-[11px] px-2 py-1 text-red-400 disabled:opacity-40">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {captions.length === 0 ? (
              <div className="text-center py-8 rounded-xl" style={{ background: 'var(--bg-tertiary)', border: '1px dashed var(--border-light)' }}>
                <Mic size={20} className="mx-auto text-[var(--text-muted)] mb-2" />
                <p className="text-xs text-[var(--text-muted)]">
                  Record karo ya manually add karo — captions yahan dikhenge
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {captions.map(cap => (
                  <div key={cap.id} className="flex items-center gap-2 rounded-lg px-2.5 py-2 group"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <input type="number" step="0.1" min="0" value={Number(cap.start.toFixed(1))}
                        onChange={e => updateCaption(cap.id, { start: parseFloat(e.target.value) || 0 })}
                        className="w-14 text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent)]" />
                      <input type="number" step="0.1" min="0" value={Number(cap.end.toFixed(1))}
                        onChange={e => updateCaption(cap.id, { end: parseFloat(e.target.value) || 0 })}
                        className="w-14 text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent)]" />
                    </div>
                    <input type="text" value={cap.text}
                      onChange={e => updateCaption(cap.id, { text: e.target.value })}
                      className="flex-1 min-w-0 text-xs bg-transparent text-white outline-none border-b border-transparent focus:border-[var(--accent)] py-1" />
                    <button onClick={() => removeCaption(cap.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-red-400 flex-shrink-0">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Manual add */}
            <div className="flex gap-2 mt-3">
              <input type="text" value={newText} placeholder="Manual caption likho…"
                onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addManual()}
                className="input flex-1 text-xs" />
              <button onClick={addManual} disabled={!newText.trim()} className="btn btn-secondary text-xs disabled:opacity-40">
                <Plus size={13} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t flex items-center justify-between flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[11px] text-[var(--text-muted)]">Captions canvas preview me live dikhenge ✨</span>
          <button onClick={close} className="btn btn-primary text-xs px-5">Done</button>
        </div>
      </div>
    </div>
  );
}
