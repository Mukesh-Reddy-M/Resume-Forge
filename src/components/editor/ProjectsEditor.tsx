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
import { ProjectItem } from '../../types/resume';
import { DraggableBulletList } from './DraggableBulletList';

interface ProjectsEditorProps {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
}

const ProjectCard = ({
  id,
  item,
  index,
  onUpdate,
  onRemove,
}: {
  id: string;
  item: ProjectItem;
  index: number;
  onUpdate: (index: number, updated: ProjectItem) => void;
  onRemove: (index: number) => void;
}) => {
  const [newStackTag, setNewStackTag] = useState('');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 15 : 1,
  };

  const handleAddStackTag = () => {
    if (!newStackTag.trim()) return;
    const currentStack = Array.isArray(item.stack) ? [...item.stack] : [];
    if (!currentStack.includes(newStackTag.trim())) {
      currentStack.push(newStackTag.trim());
      onUpdate(index, { ...item, stack: currentStack });
    }
    setNewStackTag('');
  };

  const handleRemoveStackTag = (tagIdx: number) => {
    const currentStack = (item.stack || []).filter((_, i) => i !== tagIdx);
    onUpdate(index, { ...item, stack: currentStack });
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
            title="Drag to reorder project"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800">
            {item.name || 'New Project'}{' '}
            {item.group ? (
              <span className="text-slate-400 font-normal">({item.group})</span>
            ) : (
              ''
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          title="Remove project"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Project Group & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Project Name</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => onUpdate(index, { ...item, name: e.target.value })}
              placeholder="e.g. GalliBite — Food Delivery Platform"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Section Group</label>
            <input
              type="text"
              value={item.group || ''}
              onChange={(e) => onUpdate(index, { ...item, group: e.target.value })}
              placeholder="e.g. Hackathon Projects"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
        </div>

        {/* Subtitle & Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Subtitle / Role / Award</label>
            <input
              type="text"
              value={item.subtitle || ''}
              onChange={(e) => onUpdate(index, { ...item, subtitle: e.target.value })}
              placeholder="e.g. SIH 2026 (PS 26060), Team Leader"
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Link Text / URL</label>
            <input
              type="text"
              value={item.link || ''}
              onChange={(e) => onUpdate(index, { ...item, link: e.target.value })}
              placeholder="e.g. GitHub or https://github.com/..."
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">Tech Stack Chips</label>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {(item.stack || []).map((tech, tIdx) => (
              <span
                key={tIdx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-medium"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveStackTag(tIdx)}
                  className="text-slate-400 hover:text-rose-600 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newStackTag}
              onChange={(e) => setNewStackTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddStackTag();
                }
              }}
              placeholder="Add technology (press Enter)..."
              className="flex-1 text-xs p-1.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
            <button
              type="button"
              onClick={handleAddStackTag}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0"
            >
              Add
            </button>
          </div>
        </div>

        {/* Draggable Bullets */}
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
            Project Highlights & Key Contributions (Drag to reorder)
          </label>
          <DraggableBulletList
            bullets={item.bullets || []}
            onChange={(bullets) => onUpdate(index, { ...item, bullets })}
            placeholder="Built, implemented, optimized..."
          />
        </div>
      </div>
    </div>
  );
};

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ projects = [], onChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = projects.map((_, i) => `proj-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(projects, oldIndex, newIndex));
    }
  };

  const handleUpdate = (index: number, updated: ProjectItem) => {
    const list = [...projects];
    list[index] = updated;
    onChange(list);
  };

  const handleRemove = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([
      ...projects,
      {
        group: 'Personal Projects',
        name: '',
        stack: [],
        link: '',
        subtitle: '',
        bullets: [''],
      },
    ]);
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {projects.map((item, idx) => (
              <ProjectCard
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
        <span>Add Project</span>
      </button>
    </div>
  );
};
