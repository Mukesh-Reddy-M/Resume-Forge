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
import { EducationItem } from '../../types/resume';

interface EducationEditorProps {
  education: EducationItem[];
  onChange: (education: EducationItem[]) => void;
}

const EducationCard = ({
  id,
  item,
  index,
  onUpdate,
  onRemove,
}: {
  id: string;
  item: EducationItem;
  index: number;
  onUpdate: (index: number, updated: EducationItem) => void;
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
            title="Drag to reorder education"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800">
            {item.degree || 'New Education Degree'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          title="Remove degree"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Degree / Certification</label>
            <input
              type="text"
              value={item.degree}
              onChange={(e) => onUpdate(index, { ...item, degree: e.target.value })}
              placeholder="e.g. B.Tech, Computer Science and Engineering"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Institution / University</label>
            <input
              type="text"
              value={item.school}
              onChange={(e) => onUpdate(index, { ...item, school: e.target.value })}
              placeholder="e.g. Indian Institute of Technology Madras"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Start Date</label>
            <input
              type="text"
              value={item.start}
              onChange={(e) => onUpdate(index, { ...item, start: e.target.value })}
              placeholder="e.g. 2025"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">End Date</label>
            <input
              type="text"
              value={item.end}
              onChange={(e) => onUpdate(index, { ...item, end: e.target.value })}
              placeholder="e.g. 2029 or Present"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">GPA / Grade</label>
            <input
              type="text"
              value={item.gpa || ''}
              onChange={(e) => onUpdate(index, { ...item, gpa: e.target.value })}
              placeholder="e.g. GPA: 9.2/10"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const EducationEditor: React.FC<EducationEditorProps> = ({ education = [], onChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = education.map((_, i) => `edu-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(education, oldIndex, newIndex));
    }
  };

  const handleUpdate = (index: number, updated: EducationItem) => {
    const list = [...education];
    list[index] = updated;
    onChange(list);
  };

  const handleRemove = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([
      ...education,
      { degree: '', school: '', start: '', end: '', gpa: '' },
    ]);
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {education.map((item, idx) => (
              <EducationCard
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
        <span>Add Education Entry</span>
      </button>
    </div>
  );
};
