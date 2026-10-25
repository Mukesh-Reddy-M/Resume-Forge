import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X, Upload, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { PhotoShape } from '../../types/resume';
import { getCroppedImg, getCenteredSquareCrop } from '../../lib/cropImage';
import { Modal, useTitleId } from './Modal';

interface PhotoCropModalProps {
  onClose: () => void;
  currentPhotoUrl: string | null;
  currentShape: PhotoShape;
  onSave: (photoUrl: string, shape: PhotoShape) => void;
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/** Mount only while open — all state below resets on every open. */
export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  onClose,
  currentPhotoUrl,
  currentShape,
  onSave,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(currentPhotoUrl);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [shape, setShape] = useState<PhotoShape>(currentShape || 'circle');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const titleId = useTitleId('photo-modal-title');

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file.type.startsWith('image/')) {
        setError('Please choose an image file (PNG, JPG or WebP).');
        return;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        setError('That image is larger than 5MB. Please choose a smaller one.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!imageSrc) return;
    try {
      setIsProcessing(true);
      setError(null);
      // Always re-encode to a small square JPEG: keeps localStorage usage tiny.
      const area = croppedAreaPixels ?? (await getCenteredSquareCrop(imageSrc));
      const croppedImage = await getCroppedImg(imageSrc, area, 320);
      onSave(croppedImage, shape);
      onClose();
    } catch (e) {
      console.error('Failed to crop image:', e);
      setError('Could not process that image. Try a different file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal onClose={onClose} titleId={titleId} maxWidthClass="max-w-lg">
      <div className="flex flex-col min-h-0 overflow-y-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 id={titleId} className="text-base font-bold text-slate-900">Upload & Crop Profile Photo</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Position and crop your photo for optimal ATS and template presentation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {imageSrc ? (
            <div className="space-y-4">
              <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden shadow-inner">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape={shape === 'circle' ? 'round' : 'rect'}
                  showGrid={true}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Zoom Slider */}
              <div className="flex items-center gap-3 px-2">
                <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
                <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setCrop({ x: 0, y: 0 });
                  }}
                  title="Reset Crop"
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-500 border border-slate-200">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Choose a headshot photo</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WebP up to 5MB</p>
              </div>
              <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors mt-1">
                Select Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {error && (
            <p role="alert" className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Photo Shape selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Photo Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {(['circle', 'rounded', 'square'] as PhotoShape[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShape(s)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all capitalize ${
                    shape === s
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notice hint */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] leading-relaxed text-amber-900">
            <strong>Photo Guideline:</strong> Photos are common in India/Europe, but usually avoided for US/UK applications and some ATS.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {imageSrc ? (
            <label className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!imageSrc || isProcessing}
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {isProcessing ? 'Saving...' : 'Apply Photo'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
