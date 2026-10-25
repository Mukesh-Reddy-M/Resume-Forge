import React, { useState } from 'react';
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
import { GripVertical, Trash2, Plus, X } from 'lucide-react';
import { SkillCategory } from '../../types/resume';

interface SkillsEditorProps {
  skills: SkillCategory[];
  onChange: (skills: SkillCategory[]) => void;
}

const SkillCategoryCard = ({
  id,
  item,
  index,
  onUpdate,
  onRemove,
}: {
  id: string;
  item: SkillCategory;
  index: number;
  onUpdate: (index: number, updated: SkillCategory) => void;
  onRemove: (index: number) => void;
}) => {
  const [newTag, setNewTag] = useState('');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 15 : 1,
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const items = Array.isArray(item.items) ? [...item.items] : [];
    if (!items.includes(newTag.trim())) {
      items.push(newTag.trim());
      onUpdate(index, { ...item, items });
    }
    setNewTag('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagIdx: number) => {
    const items = (item.items || []).filter((_, i) => i !== tagIdx);
    onUpdate(index, { ...item, items });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3.5 bg-slate-50 rounded-xl border transition-all ${
        isDragging
          ? 'shadow-lg border-slate-900 bg-white ring-2 ring-slate-900/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5 rounded touch-none"
            title="Drag to reorder skill category"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={item.category}
            onChange={(e) => onUpdate(index, { ...item, category: e.target.value })}
            placeholder="Category (e.g. Languages, AI/ML)"
            className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none px-1 py-0.5 flex-1"
          />
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          title="Remove category"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        {(item.items || []).map((skill, sIdx) => (
          <span
            key={sIdx}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(sIdx)}
              className="text-slate-400 hover:text-rose-600 rounded"
              title="Remove skill"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Input to add chip */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add skill (press Enter or comma)..."
          className="flex-1 text-xs p-1.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills = [], onChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = skills.map((_, i) => `skill-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(skills, oldIndex, newIndex));
    }
  };

  const handleUpdate = (index: number, updated: SkillCategory) => {
    const list = [...skills];
    list[index] = updated;
    onChange(list);
  };

  const handleRemove = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleAddCategory = () => {
    onChange([...skills, { category: 'New Category', items: [] }]);
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {skills.map((item, idx) => (
              <SkillCategoryCard
                key={ids[idx]}
                id={ids[idx]}
                item={item}
                index={idx}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={handleAddCategory}
        className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-slate-50 cursor-pointer"
      >
        <Plus className="w-4 h-4 text-slate-500" />
        <span>Add Skill Category</span>
      </button>
    </div>
  );
};
