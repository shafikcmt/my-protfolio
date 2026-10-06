'use client'

import { useRef, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, ArrowRight, Film, ImagePlus, Link2, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { getEmbedUrl, isDirectVideo, toUrlList } from '@/lib/media'

type MediaKind = 'image' | 'gallery' | 'video'

interface MediaUploadFieldProps {
  id: string
  kind: MediaKind
  /** image/video: a single URL string. gallery: newline separated URLs. */
  value: string
  onChange: (value: string) => void
  folder?: string
  placeholder?: string
}

const MAX_IMAGE_MB = 10
const MAX_VIDEO_MB = 100

async function uploadToCloudinary(file: File, folder: string, onProgress: (pct: number) => void) {
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
  const { data } = await axios.post('/api/admin/upload', { resourceType, folder })
  const { uploadUrl, fields } = data.data as { uploadUrl: string; fields: Record<string, string> }

  const form = new FormData()
  Object.entries(fields).forEach(([key, val]) => form.append(key, val))
  form.append('file', file)

  // axios (XHR) gives upload progress events; cookies are not sent to Cloudinary.
  const result = await axios.post(uploadUrl, form, {
    withCredentials: false,
    onUploadProgress: (event) => {
      if (event.total) onProgress(Math.round((event.loaded / event.total) * 100))
    },
  })
  return String(result.data.secure_url)
}

export default function MediaUploadField({ id, kind, value, onChange, folder = 'uploads', placeholder }: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [urlDraft, setUrlDraft] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const urls = kind === 'gallery' ? toUrlList(value) : value ? [value] : []
  const accept = kind === 'video' ? 'video/*' : 'image/*'

  const setUrls = (next: string[]) => onChange(kind === 'gallery' ? next.join('\n') : next[0] || '')

  const addUrls = (added: string[]) => {
    if (!added.length) return
    setUrls(kind === 'gallery' ? [...urls, ...added] : [added[added.length - 1]])
  }

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    setError('')

    const selected = kind === 'gallery' ? files : files.slice(0, 1)
    for (const file of selected) {
      const isVideo = file.type.startsWith('video/')
      const limit = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB
      if ((kind === 'video') !== isVideo) {
        setError(kind === 'video' ? 'Please choose a video file.' : 'Please choose an image file.')
        return
      }
      if (file.size > limit * 1024 * 1024) {
        setError(`"${file.name}" is larger than ${limit}MB.`)
        return
      }
    }

    setUploading(true)
    const uploaded: string[] = []
    try {
      for (const file of selected) {
        setProgress(0)
        uploaded.push(await uploadToCloudinary(file, folder, setProgress))
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error?.message || 'Upload failed. Try again or paste a URL.')
    } finally {
      addUrls(uploaded)
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleAddUrl = () => {
    const added = kind === 'gallery' ? toUrlList(urlDraft) : [urlDraft.trim()].filter(Boolean)
    addUrls(added)
    setUrlDraft('')
  }

  const move = (index: number, delta: number) => {
    const next = [...urls]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setUrls(next)
  }

  const remove = (index: number) => setUrls(urls.filter((_, i) => i !== index))

  const showDropzone = kind === 'gallery' || urls.length === 0

  return (
    <div className="space-y-3">
      {/* Previews */}
      {kind === 'video' && urls[0] && <VideoPreview url={urls[0]} onRemove={() => remove(0)} />}

      {kind !== 'video' && urls.length > 0 && (
        <div className={kind === 'gallery' ? 'grid grid-cols-2 gap-3 sm:grid-cols-3' : ''}>
          {urls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${kind === 'image' ? 'aspect-video max-w-md' : 'aspect-video'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Media ${i + 1}`} className="h-full w-full object-cover" />
              {kind === 'gallery' && i === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-gradient-to-t from-slate-900/70 to-transparent p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                {kind === 'gallery' && (
                  <>
                    <IconButton label="Move left" onClick={() => move(i, -1)} disabled={i === 0}>
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton label="Move right" onClick={() => move(i, 1)} disabled={i === urls.length - 1}>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </IconButton>
                  </>
                )}
                <IconButton label="Remove" onClick={() => remove(i)} danger>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {showDropzone && (
        <button
          type="button"
          id={id}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          disabled={uploading}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-7 text-center transition ${
            dragOver ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-slate-50/60 hover:border-teal-400 hover:bg-teal-50/40'
          } disabled:cursor-wait`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              <span className="text-sm font-semibold text-slate-700">Uploading… {progress}%</span>
              <span className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} />
              </span>
            </>
          ) : (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-teal-600 shadow-sm ring-1 ring-slate-200">
                {kind === 'video' ? <Film className="h-5 w-5" /> : kind === 'gallery' ? <ImagePlus className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {kind === 'gallery' ? 'Drop screenshots here or click to upload' : kind === 'video' ? 'Drop a demo video or click to upload' : 'Drop an image or click to upload'}
              </span>
              <span className="text-xs text-slate-500">
                {kind === 'video' ? `MP4 / WebM up to ${MAX_VIDEO_MB}MB` : `PNG, JPG, WebP up to ${MAX_IMAGE_MB}MB${kind === 'gallery' ? ' · multiple allowed' : ''}`}
              </span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={kind === 'gallery'}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Paste URL */}
      {showDropzone && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl() } }}
              placeholder={placeholder || (kind === 'video' ? 'Or paste YouTube / Vimeo / Loom / Drive link' : 'Or paste an image URL')}
              className="input-field !pl-10"
            />
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlDraft.trim()}
            className="rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}

      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
    </div>
  )
}

function VideoPreview({ url, onRemove }: { url: string; onRemove: () => void }) {
  const embed = getEmbedUrl(url)
  const direct = isDirectVideo(url)

  return (
    <div className="space-y-2">
      <div className="aspect-video max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
        {direct ? (
          <video src={url} controls className="h-full w-full" />
        ) : embed ? (
          <iframe src={embed} className="h-full w-full" allow="fullscreen; picture-in-picture" allowFullScreen title="Video preview" />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-xs text-slate-300">
            This link cannot be previewed. Use YouTube, Vimeo, Loom, Google Drive or an .mp4 file.
          </div>
        )}
      </div>
      <div className="flex max-w-xl items-center gap-2">
        <p className="flex-1 truncate text-xs text-slate-500">{url}</p>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>
    </div>
  )
}

function IconButton({ children, label, onClick, disabled, danger }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 shadow-sm transition disabled:opacity-30 ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-white'}`}
    >
      {children}
    </button>
  )
}
