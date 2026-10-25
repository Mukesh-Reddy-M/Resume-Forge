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

interface DraggableBulletListProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  placeholder?: string;
}

const BulletItem = ({
  id,
  bullet,
  index,
  onUpdate,
  onRemove,
  placeholder,
}: {
  id: string;
  bullet: string;
  index: number;
  onUpdate: (index: number, val: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
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
      className={`flex items-start gap-1.5 p-1.5 bg-white rounded-lg border text-xs group transition-all ${
        isDragging
          ? 'shadow-md border-slate-900 ring-2 ring-slate-900/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        title="Drag to reorder bullet"
        className="mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5 rounded touch-none shrink-0"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      <textarea
        value={bullet}
        onChange={(e) => onUpdate(index, e.target.value)}
        placeholder={placeholder || 'Describe accomplishment or responsibility...'}
        rows={2}
        className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none resize-y py-0.5"
      />

      <button
        type="button"
        onClick={() => onRemove(index)}
        title="Remove bullet"
        className="mt-1 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors shrink-0 opacity-80 group-hover:opacity-100"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const DraggableBulletList: React.FC<DraggableBulletListProps> = ({
  bullets = [],
  onChange,
  placeholder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Generate stable keys based on index
  const ids = bullets.map((_, i) => `bullet-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(bullets, oldIndex, newIndex));
    }
  };

  const handleUpdate = (index: number, val: string) => {
    const updated = [...bullets];
    updated[index] = val;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = bullets.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...bullets, '']);
  };

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {bullets.map((b, idx) => (
              <BulletItem
                key={ids[idx]}
                id={ids[idx]}
                bullet={b}
                index={idx}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                placeholder={placeholder}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-slate-500" />
        <span>Add Bullet Point</span>
      </button>
    </div>
  );
};
