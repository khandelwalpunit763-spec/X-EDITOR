import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, QrCode, Search } from 'lucide-react'

interface Props {
  onScan: (decodedText: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: Props) {
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const start = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan(decodedText)
            stop()
            onClose()
          },
          () => {}
        )
        setIsScanning(true)
      } catch (e: any) {
        setError(e?.message || 'Camera access failed. Check permissions.')
      }
    }
    start()
    return () => { stop() }
  }, [])

  const stop = async () => {
    try {
      if (scannerRef.current?.isScanning) await scannerRef.current.stop()
      scannerRef.current?.clear()
    } catch {}
    setIsScanning(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-bold flex items-center gap-2"><QrCode size={16} className="text-indigo-400" /> QR Scan Karein</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] text-gray-500"><X size={16} /></button>
        </div>
        <div className="p-4">
          <div id="qr-reader" className="w-full rounded-xl overflow-hidden bg-black" style={{ minHeight: 260 }} />
          {error && <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}
          <p className="text-[11px] text-gray-500 mt-3 text-center">
            Template ke QR ko camera ke samne lao — auto search ho jayega. <br />
            <span className="text-gray-600">Tip: Title se bhi search kar sakte ho</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Simple title search bar with QR button
export function TemplateSearchBar({ onSearch, onQRScan }: { onSearch: (q: string)=>void, onQRScan: ()=>void }) {
  const [q, setQ] = useState('')
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={q} onChange={e=>{setQ(e.target.value); onSearch(e.target.value)}} placeholder="Title se search... e.g. YouTube" className="input pl-9 w-full text-xs" />
      </div>
      <button onClick={onQRScan} className="btn btn-secondary px-3 text-xs"><QrCode size={14} /> Scan QR</button>
    </div>
  )
}
