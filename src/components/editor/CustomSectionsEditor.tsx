import React from 'react';
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import { CustomSection } from '../../types/resume';
import { DraggableBulletList } from './DraggableBulletList';

interface CustomSectionsEditorProps {
  custom: CustomSection[];
  onChange: (custom: CustomSection[]) => void;
  onAddSectionToOrder: (sectionId: string) => void;
}

export const CustomSectionsEditor: React.FC<CustomSectionsEditorProps> = ({
  custom = [],
  onChange,
  onAddSectionToOrder,
}) => {
  const handleUpdateSection = (index: number, updated: CustomSection) => {
    const list = [...custom];
    list[index] = updated;
    onChange(list);
  };

  const handleRemoveSection = (index: number) => {
    onChange(custom.filter((_, i) => i !== index));
  };

  const handleAddSection = () => {
    const newId = `custom_${Date.now()}`;
    const newSection: CustomSection = {
      id: newId,
      title: 'New Custom Section',
      bullets: [''],
    };
    onChange([...custom, newSection]);
    onAddSectionToOrder(newId);
  };

  return (
    <div className="space-y-4">
      {custom.map((section, idx) => (
        <div
          key={section.id || idx}
          className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3"
        >
          {/* Section Title & Delete */}
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={section.title}
              onChange={(e) =>
                handleUpdateSection(idx, { ...section, title: e.target.value })
              }
              placeholder="Section Title (e.g. Certifications, Awards)"
              className="text-xs font-bold text-slate-800 bg-white border border-slate-200 focus:border-slate-900 rounded-lg px-2.5 py-1.5 focus:outline-none flex-1"
            />
            <button
              type="button"
              onClick={() => handleRemoveSection(idx)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              title="Delete custom section"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bullets with drag-and-drop */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Section Bullets (Drag to reorder)
            </label>
            <DraggableBulletList
              bullets={section.bullets || []}
              onChange={(bullets) => handleUpdateSection(idx, { ...section, bullets })}
              placeholder="Achievement or detail..."
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddSection}
        className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-slate-50 cursor-pointer"
      >
        <Plus className="w-4 h-4 text-slate-500" />
        <span>Add Custom Section</span>
      </button>
    </div>
  );
};
