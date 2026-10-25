import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Maximize2,
  Camera,
  Eye,
  EyeOff,
  GripVertical,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  Resume,
  TemplateDefinition,
  DensityPresetId,
  PhotoShape,
  FontPair,
} from '../../types/resume';
import {
  TEMPLATES,
  FONT_PAIRS,
  ACCENT_PALETTE,
  DENSITY_PRESETS,
  getDensityPreset,
  getFontPairById,
} from '../../lib/data';
import { getTemplateComponent } from '../../templates';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StylePanelProps {
  resume: Resume;
  onChange: (updated: Resume) => void;
  onOpenPhotoCrop: () => void;
}

// Section metadata labels
const SECTION_LABELS: Record<string, string> = {
  summary: 'Professional Summary',
  education: 'Education',
  skills: 'Technical Skills',
  experience: 'Work Experience',
  projects: 'Projects',
  competitions: 'Competitions & CTF',
  achievements: 'Achievements',
};

// Sortable Item for Section Reordering
const SortableSectionItem = ({
  id,
  label,
  isHidden,
  onToggleHide,
}: {
  id: string;
  label: string;
  isHidden: boolean;
  onToggleHide: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between px-3 py-2 bg-white rounded-lg border text-xs transition-all ${
        isDragging
          ? 'shadow-md border-slate-900 ring-2 ring-slate-900/10'
          : 'border-slate-200 hover:border-slate-300'
      } ${isHidden ? 'opacity-50 bg-slate-50' : ''}`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5 rounded touch-none"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <span className="font-medium text-slate-700 truncate">{label}</span>
      </div>

      <button
        type="button"
        onClick={() => onToggleHide(id)}
        title={isHidden ? 'Show Section' : 'Hide Section'}
        className={`p-1 rounded transition-colors ${
          isHidden ? 'text-slate-400 hover:text-slate-600' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

export const StylePanel: React.FC<StylePanelProps> = ({
  resume,
  onChange,
  onOpenPhotoCrop,
}) => {
  const meta = resume.meta;
  const currentTemplate = TEMPLATES.find((t) => t.id === meta.templateId) || TEMPLATES[0];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Template select
  const handleSelectTemplate = (template: TemplateDefinition) => {
    onChange({
      ...resume,
      meta: {
        ...resume.meta,
        templateId: template.id,
        // Adopt the template's own look (what its thumbnail shows).
        fontId: template.defaultFontId,
        accent: template.defaultAccent,
        // if template doesn't support photo, turn showPhoto off
        showPhoto: template.supportsPhoto ? resume.meta.showPhoto && !!resume.meta.photoUrl : false,
      },
    });
  };

  // Font change
  const handleSelectFont = (fontId: string) => {
    onChange({
      ...resume,
      meta: { ...resume.meta, fontId },
    });
  };

  // Accent change
  const handleSelectAccent = (color: string) => {
    onChange({
      ...resume,
      meta: { ...resume.meta, accent: color },
    });
  };

  // Density change
  const handleSelectDensity = (density: DensityPresetId) => {
    onChange({
      ...resume,
      meta: { ...resume.meta, density },
    });
  };

  // Photo toggle
  const handleTogglePhoto = () => {
    if (!currentTemplate.supportsPhoto) return;
    const nextVal = !meta.showPhoto;
    if (nextVal && !meta.photoUrl) {
      // No photo yet: open the uploader. The toggle only flips on once a photo is
      // actually applied (see App.handlePhotoSave), so cancelling leaves it off.
      onOpenPhotoCrop();
      return;
    }
    onChange({
      ...resume,
      meta: { ...resume.meta, showPhoto: nextVal },
    });
  };

  // Photo shape
  const handleChangePhotoShape = (shape: PhotoShape) => {
    onChange({
      ...resume,
      meta: { ...resume.meta, photoShape: shape },
    });
  };

  // Section order & hidden sections
  const hiddenSections = new Set(meta.hiddenSections || []);
  const allOrder = meta.sectionOrder || [
    'summary',
    'education',
    'skills',
    'experience',
    'projects',
  ];

  // Include custom sections if any aren't in order yet
  const fullOrder = [...allOrder];
  resume.custom?.forEach((c) => {
    if (!fullOrder.includes(c.id)) {
      fullOrder.push(c.id);
    }
  });

  const handleToggleHide = (sectionId: string) => {
    const updated = new Set(hiddenSections);
    if (updated.has(sectionId)) {
      updated.delete(sectionId);
    } else {
      updated.add(sectionId);
    }
    onChange({
      ...resume,
      meta: {
        ...resume.meta,
        hiddenSections: Array.from(updated),
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fullOrder.indexOf(active.id as string);
    const newIndex = fullOrder.indexOf(over.id as string);
    const newOrder = arrayMove(fullOrder, oldIndex, newIndex);

    onChange({
      ...resume,
      meta: {
        ...resume.meta,
        sectionOrder: newOrder,
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-900 border-l border-slate-200">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Styling & Layout</h2>
        </div>
        <span className="text-[11px] font-medium text-slate-400">Customise Look</span>
      </div>

      {/* Scrollable controls */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* 1. Template Picker with Miniature Live Previews */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-slate-500" />
              <span>Resume Template</span>
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              {TEMPLATES.length} Styles
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((tpl) => {
              const isSelected = tpl.id === meta.templateId;
              const TplComp = getTemplateComponent(tpl.id);
              const previewStyle = {
                template: tpl,
                density: DENSITY_PRESETS.compact,
                fontPair: getFontPairById(isSelected ? meta.fontId : tpl.defaultFontId),
                accent: isSelected ? meta.accent : tpl.defaultAccent,
                showPhoto: tpl.supportsPhoto && meta.showPhoto && !!meta.photoUrl,
                photoUrl: meta.photoUrl,
                photoShape: meta.photoShape,
              };

              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`group relative text-left rounded-xl border p-2 flex flex-col transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900/5 ring-2 ring-slate-900/10 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  {/* Miniature live preview container */}
                  <div className="w-full h-32 rounded-lg bg-white overflow-hidden border border-slate-200/80 relative shadow-2xs mb-2">
                    <div
                      className="origin-top-left pointer-events-none select-none"
                      style={{
                        width: '794px',
                        height: '1123px',
                        transform: 'scale(0.145)',
                        padding: '12mm',
                      }}
                    >
                      <TplComp data={resume} style={previewStyle} isThumbnail={true} />
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900">
                      {tpl.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {tpl.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Pair Dropdown */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <span>Typography Pairing</span>
          </label>
          <div className="relative">
            <select
              value={meta.fontId}
              onChange={(e) => handleSelectFont(e.target.value)}
              className="w-full text-xs font-medium py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer shadow-2xs"
            >
              {FONT_PAIRS.map((fp) => (
                <option key={fp.id} value={fp.id}>
                  {fp.label} ({fp.heading} / {fp.body})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Accent Color Swatches + Color Picker */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>Accent Color</span>
            </label>
            <span className="text-[11px] font-mono text-slate-500 uppercase">{meta.accent}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {ACCENT_PALETTE.map((color) => {
              const isSelected = (meta.accent || '').toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSelectAccent(color)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative shadow-xs ${
                    isSelected ? 'scale-110 ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 drop-shadow-xs" />
                    </span>
                  )}
                </button>
              );
            })}

            {/* Custom Color Input */}
            <label
              title="Custom Hex Color"
              className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-500 overflow-hidden relative shadow-xs"
            >
              <input
                type="color"
                value={meta.accent}
                onChange={(e) => handleSelectAccent(e.target.value)}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
              />
              <span
                className="w-full h-full"
                style={{
                  background:
                    'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                }}
              />
            </label>
          </div>
        </div>

        {/* 4. Density Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Density Preset</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'comfortable', 'spacious'] as DensityPresetId[]).map((d) => {
              const isSelected = meta.density === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleSelectDensity(d)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center capitalize transition-colors ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Photo Controls & Toggle */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <label className="text-xs font-bold text-slate-800">Candidate Photo</label>
            </div>

            {/* Toggle switch */}
            <div className="relative group">
              <button
                type="button"
                disabled={!currentTemplate.supportsPhoto}
                onClick={handleTogglePhoto}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  meta.showPhoto && currentTemplate.supportsPhoto
                    ? 'bg-slate-900'
                    : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    meta.showPhoto && currentTemplate.supportsPhoto
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>

              {!currentTemplate.supportsPhoto && (
                <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block w-44 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-lg z-30 pointer-events-none">
                  The "{currentTemplate.name}" template is designed for pure technical ATS text and does not support photos.
                </div>
              )}
            </div>
          </div>

          {/* Photo Actions if enabled */}
          {meta.showPhoto && currentTemplate.supportsPhoto && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {meta.photoUrl ? (
                    <img
                      src={meta.photoUrl}
                      alt="Profile preview"
                      className={`w-9 h-9 object-cover border border-slate-300 shadow-2xs ${
                        meta.photoShape === 'circle'
                          ? 'rounded-full'
                          : meta.photoShape === 'rounded'
                          ? 'rounded-lg'
                          : 'rounded-none'
                      }`}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <Camera className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {meta.photoUrl ? 'Photo Active' : 'No photo uploaded'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      1:1 Aspect Headshot
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenPhotoCrop}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                >
                  {meta.photoUrl ? 'Crop / Replace' : 'Upload'}
                </button>
              </div>

              {/* Shape choices */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Crop Shape
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['circle', 'rounded', 'square'] as PhotoShape[]).map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => handleChangePhotoShape(shape)}
                      className={`py-1 text-[11px] font-medium rounded-md border capitalize transition-colors ${
                        meta.photoShape === shape
                          ? 'border-slate-800 bg-slate-800 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informative Hint */}
              <p className="text-[10.5px] leading-relaxed text-slate-500 bg-white p-2 rounded-lg border border-slate-200/70">
                <span className="font-semibold text-slate-700">Notice:</span> Photos are common in India/Europe, but usually avoided for US/UK applications and some ATS.
              </p>
            </div>
          )}
        </div>

        {/* 6. Section Reordering & Visibility Manager */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <GripVertical className="w-3.5 h-3.5 text-slate-500" />
              <span>Section Order & Visibility</span>
            </label>
            <span className="text-[11px] text-slate-400">Drag to arrange</span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fullOrder} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                {fullOrder.map((sectionId) => {
                  const customSec = resume.custom?.find((c) => c.id === sectionId);
                  const label = customSec?.title || SECTION_LABELS[sectionId] || sectionId;
                  const isHidden = hiddenSections.has(sectionId);

                  return (
                    <SortableSectionItem
                      key={sectionId}
                      id={sectionId}
                      label={label}
                      isHidden={isHidden}
                      onToggleHide={handleToggleHide}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};
