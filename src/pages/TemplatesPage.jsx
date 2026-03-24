import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { mockTemplates } from '../data/mockData';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, Search, FileText } from 'lucide-react';

const categories = ['All', 'Sales', 'Marketing', 'Finance', 'Product', 'Business'];

const catColors = {
  Sales: 'bg-blue-50 text-blue-700',
  Marketing: 'bg-purple-50 text-purple-700',
  Finance: 'bg-emerald-50 text-emerald-700',
  Product: 'bg-amber-50 text-amber-700',
  Business: 'bg-indigo-50 text-indigo-700',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [previewTpl, setPreviewTpl] = useState(null);
  const [editTpl, setEditTpl] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [newTpl, setNewTpl] = useState({ name: '', category: 'Sales', subject: '', body: '' });

  const filtered = templates.filter((t) =>
    (activeCategory === 'All' || t.category === activeCategory) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = () => {
    setTemplates((ts) => ts.filter((t) => t.id !== deleteId));
    setDeleteId(null);
    toast.success('Template deleted');
  };

  const handleCreate = () => {
    if (!newTpl.name || !newTpl.subject) return toast.error('Name and subject are required');
    const id = String(Date.now());
    setTemplates((ts) => [...ts, { ...newTpl, id, updatedAt: '2026-03-24' }]);
    setCreateModal(false);
    setNewTpl({ name: '', category: 'Sales', subject: '', body: '' });
    toast.success('Template created');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and reuse email templates</p>
        </div>
        <Button icon={Plus} onClick={() => setCreateModal(true)}>New Template</Button>
      </div>

      {/* Search + Category filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search templates..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeCategory === c ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No templates found</p>
          <Button variant="secondary" size="sm" className="mt-4" icon={Plus} onClick={() => setCreateModal(true)}>Create Template</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tpl) => (
            <Card key={tpl.id} hover padding={false} className="group flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColors[tpl.category] || 'bg-gray-100 text-gray-600'}`}>
                    {tpl.category}
                  </span>
                  <span className="text-xs text-gray-400">{tpl.updatedAt}</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{tpl.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-1">{tpl.subject}</p>
                <div className="mt-3 bg-gray-50 rounded-lg p-2.5 text-xs text-gray-400 line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: tpl.body }}
                />
              </div>
              <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-2">
                <button onClick={() => setPreviewTpl(tpl)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                  <Eye size={12} /> Preview
                </button>
                <button onClick={() => setEditTpl(tpl)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => setDeleteId(tpl.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors ml-auto font-medium">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview modal */}
      <Modal isOpen={!!previewTpl} onClose={() => setPreviewTpl(null)} title={previewTpl?.name} size="lg">
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg px-4 py-2.5 text-sm">
            <span className="text-gray-400 text-xs">Subject: </span>
            <span className="text-gray-700 font-medium">{previewTpl?.subject}</span>
          </div>
          <div className="border border-gray-100 rounded-xl p-5 min-h-32 text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: previewTpl?.body }}
          />
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editTpl} onClose={() => setEditTpl(null)} title="Edit Template" size="lg">
        <div className="space-y-3">
          <Input label="Template Name" value={editTpl?.name || ''} onChange={(e) => setEditTpl((t) => ({ ...t, name: e.target.value }))} />
          <Input label="Subject" value={editTpl?.subject || ''} onChange={(e) => setEditTpl((t) => ({ ...t, subject: e.target.value }))} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setEditTpl(null)}>Cancel</Button>
            <Button onClick={() => {
              setTemplates((ts) => ts.map((t) => t.id === editTpl.id ? editTpl : t));
              setEditTpl(null);
              toast.success('Template updated');
            }}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Template?" size="sm">
        <p className="text-sm text-gray-500 mb-5">This action cannot be undone. This template will be permanently removed.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" icon={Trash2} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>

      {/* Create modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="New Template" size="lg">
        <div className="space-y-3">
          <Input label="Template Name" placeholder="e.g. Follow-up Email" value={newTpl.name} onChange={(e) => setNewTpl((t) => ({ ...t, name: e.target.value }))} />
          <Input label="Subject" placeholder="Email subject with {{variables}}" value={newTpl.subject} onChange={(e) => setNewTpl((t) => ({ ...t, subject: e.target.value }))} />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <select value={newTpl.category} onChange={(e) => setNewTpl((t) => ({ ...t, category: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {['Sales', 'Marketing', 'Finance', 'Product', 'Business'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Body</label>
            <textarea rows={5} placeholder="Email body (HTML allowed)..." value={newTpl.body} onChange={(e) => setNewTpl((t) => ({ ...t, body: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button icon={Plus} onClick={handleCreate}>Create Template</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
