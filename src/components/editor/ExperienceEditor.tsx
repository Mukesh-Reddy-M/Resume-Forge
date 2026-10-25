import React from 'react';
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
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { ExperienceItem } from '../../types/resume';
import { DraggableBulletList } from './DraggableBulletList';

interface ExperienceEditorProps {
  experience: ExperienceItem[];
  onChange: (experience: ExperienceItem[]) => void;
}

const ExperienceCard = ({
  id,
  item,
  index,
  onUpdate,
  onRemove,
}: {
  id: string;
  item: ExperienceItem;
  index: number;
  onUpdate: (index: number, updated: ExperienceItem) => void;
  onRemove: (index: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 15 : 1,
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
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5 rounded touch-none"
            title="Drag to reorder position"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800">
            {item.role || 'New Job Position'}{' '}
            {item.company ? `at ${item.company}` : ''}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          title="Remove position"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Role & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Role / Title</label>
            <input
              type="text"
              value={item.role}
              onChange={(e) => onUpdate(index, { ...item, role: e.target.value })}
              placeholder="e.g. Full-Stack AI Developer"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Company / Organization</label>
            <input
              type="text"
              value={item.company}
              onChange={(e) => onUpdate(index, { ...item, company: e.target.value })}
              placeholder="e.g. Kinetic Flow AI"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Start Date</label>
            <input
              type="text"
              value={item.start}
              onChange={(e) => onUpdate(index, { ...item, start: e.target.value })}
              placeholder="e.g. Oct 2025"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">End Date</label>
            <input
              type="text"
              value={item.end}
              onChange={(e) => onUpdate(index, { ...item, end: e.target.value })}
              placeholder="e.g. Present"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
        </div>

        {/* Bullets with drag-and-drop */}
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
            Key Responsibilities & Impact (Drag to reorder)
          </label>
          <DraggableBulletList
            bullets={item.bullets || []}
            onChange={(bullets) => onUpdate(index, { ...item, bullets })}
            placeholder="Action verb + context + measurable result..."
          />
        </div>
      </div>
    </div>
  );
};

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experience = [],
  onChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = experience.map((_, i) => `exp-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(experience, oldIndex, newIndex));
    }
  };

  const handleUpdate = (index: number, updated: ExperienceItem) => {
    const list = [...experience];
    list[index] = updated;
    onChange(list);
  };

  const handleRemove = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([
      ...experience,
      { role: '', company: '', start: '', end: '', bullets: [''] },
    ]);
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {experience.map((item, idx) => (
              <ExperienceCard
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
        onClick={handleAdd}
        className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-slate-50 cursor-pointer"
      >
        <Plus className="w-4 h-4 text-slate-500" />
        <span>Add Experience Position</span>
      </button>
    </div>
  );
};
