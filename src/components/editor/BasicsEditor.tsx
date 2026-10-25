import React from 'react';
import { Basics, LinkItem } from '../../types/resume';
import { Plus, Trash2, Globe, Mail, Phone, MapPin, User, Briefcase } from 'lucide-react';

interface BasicsEditorProps {
  basics: Basics;
  onChange: (basics: Basics) => void;
}

export const BasicsEditor: React.FC<BasicsEditorProps> = ({ basics, onChange }) => {
  const updateField = (field: keyof Basics, value: any) => {
    onChange({ ...basics, [field]: value });
  };

  const handleLinkChange = (index: number, key: keyof LinkItem, val: string) => {
    const updatedLinks = [...(basics.links || [])];
    updatedLinks[index] = { ...updatedLinks[index], [key]: val };
    onChange({ ...basics, links: updatedLinks });
  };

  const handleAddLink = () => {
    onChange({
      ...basics,
      links: [...(basics.links || []), { label: '', url: '' }],
    });
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = (basics.links || []).filter((_, i) => i !== index);
    onChange({ ...basics, links: updatedLinks });
  };

  return (
    <div className="space-y-4">
      {/* Name and Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Full Name *</span>
          </label>
          <input
            type="text"
            value={basics.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Mukesh Reddy"
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-medium"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>Headline / Title</span>
          </label>
          <input
            type="text"
            value={basics.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. Full-Stack AI Developer"
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
          />
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Email</span>
          </label>
          <input
            type="email"
            value={basics.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="name@domain.com"
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>Phone</span>
          </label>
          <input
            type="tel"
            value={basics.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+91 85006 35807"
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Location</span>
          </label>
          <input
            type="text"
            value={basics.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Hyderabad, India"
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
          />
        </div>
      </div>

      {/* Online Links */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Online Profiles & Links</span>
          </label>
          <button
            type="button"
            onClick={handleAddLink}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:bg-slate-100 px-2 py-0.5 rounded transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-2">
          {(basics.links || []).map((link, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                placeholder="Label (e.g. LinkedIn, GitHub)"
                className="w-1/3 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                placeholder="URL or handle (e.g. linkedin.com/in/mukesh)"
                className="flex-1 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
              <button
                type="button"
                onClick={() => handleRemoveLink(idx)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
