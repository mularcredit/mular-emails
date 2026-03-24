import { useState, useMemo, useEffect } from 'react';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';
import { Plus, Search, Upload, Mail, Trash2, Users, Loader2 } from 'lucide-react';

const ALL_TAGS = ['All', 'Client', 'Lead', 'Partner', 'VIP', 'Investor', 'Vendor', 'Finance', 'Tech'];

const tagColors = {
  Client: 'bg-blue-50 text-blue-700 border-blue-100',
  Lead: 'bg-amber-50 text-amber-700 border-amber-100',
  Partner: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  VIP: 'bg-violet-50 text-violet-700 border-violet-100',
  Investor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Vendor: 'bg-rose-50 text-rose-700 border-rose-100',
  Finance: 'bg-teal-50 text-teal-700 border-teal-100',
  Tech: 'bg-cyan-50 text-cyan-700 border-cyan-100',
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('All');
  const [addModal, setAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newContact, setNewContact] = useState({ name: '', email: '', company: '', tags: '' });

  const fetchContacts = async () => {
    try {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        headers: { 'api-key': import.meta.env.VITE_BREVO_API_KEY, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = (data.contacts || []).map(c => ({
          id: c.id?.toString(),
          name: c.attributes?.FIRSTNAME ? `${c.attributes.FIRSTNAME} ${c.attributes.LASTNAME || ''}`.trim() : c.email.split('@')[0],
          email: c.email,
          company: c.attributes?.COMPANY || '',
          tags: [], 
          addedAt: new Date(c.createdAt).toLocaleDateString()
        }));
        setContacts(formatted);
      }
    } catch (e) {
      toast.error('Failed to load live contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = useMemo(() => contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchTag = tagFilter === 'All' || c.tags.includes(tagFilter);
    return matchSearch && matchTag;
  }), [contacts, search, tagFilter]);

  const handleAdd = async () => {
    if (!newContact.email) return toast.error('Email is required');
    try {
      const attributes = {};
      if (newContact.name) {
        const parts = newContact.name.split(' ');
        attributes.FIRSTNAME = parts[0];
        if (parts.length > 1) attributes.LASTNAME = parts.slice(1).join(' ');
      }
      if (newContact.company) attributes.COMPANY = newContact.company;

      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': import.meta.env.VITE_BREVO_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newContact.email, attributes })
      });
      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.message || 'Creation failed');
      }
      toast.success('Live contact added');
      setAddModal(false);
      setNewContact({ name: '', email: '', company: '', tags: '' });
      fetchContacts();
    } catch (err) {
      toast.error(err.message || 'Failed to add contact');
    }
  };

  const handleDelete = () => {
    setContacts((cs) => cs.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    toast.success('Contact deleted');
  };

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarColors = ['bg-indigo-100 text-indigo-700', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700', 'bg-purple-100 text-purple-700', 'bg-rose-100 text-rose-700'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{contacts.length} contacts in your list</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Upload} onClick={() => toast.success('CSV import coming soon')}>
            Import CSV
          </Button>
          <Button icon={Plus} size="sm" onClick={() => setAddModal(true)}>Add Contact</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search contacts..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TAGS.map((tag) => (
            <button key={tag} onClick={() => setTagFilter(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                tagFilter === tag ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >{tag}</button>
          ))}
        </div>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Contact', 'Email', 'Company', 'Tags', 'Added', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                    <Users size={36} className="text-gray-200 mx-auto mb-2" />
                    No contacts found
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                          {getInitials(c.name)}
                        </div>
                        <span className="font-medium text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{c.email}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{c.company}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map((tag) => (
                          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-600 border-gray-100'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{c.addedAt}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors" title="Send email">
                          <Mail size={14} />
                        </button>
                        <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {contacts.length} contacts
        </div>
      </Card>

      {/* Add Contact Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Contact">
        <div className="space-y-3">
          <Input label="Full Name" placeholder="Jane Smith" value={newContact.name} onChange={(e) => setNewContact((c) => ({ ...c, name: e.target.value }))} />
          <Input label="Email" type="email" placeholder="jane@company.com" value={newContact.email} onChange={(e) => setNewContact((c) => ({ ...c, email: e.target.value }))} />
          <Input label="Company" placeholder="Company Inc." value={newContact.company} onChange={(e) => setNewContact((c) => ({ ...c, company: e.target.value }))} />
          <Input label="Tags (comma-separated)" placeholder="Client, VIP, Lead" value={newContact.tags} onChange={(e) => setNewContact((c) => ({ ...c, tags: e.target.value }))} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button icon={Plus} onClick={handleAdd}>Add Contact</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Contact?" size="sm">
        <p className="text-sm text-gray-500 mb-5">This contact will be permanently removed from your list.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" icon={Trash2} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
