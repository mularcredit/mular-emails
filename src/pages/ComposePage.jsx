import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { mockTemplates } from '../data/mockData';
import {
  Send, Save, Zap, Settings, Plus, X, Paperclip, ChevronDown, User,
  Variable, Eye, TestTube, Check, Search
} from 'lucide-react';

const PERSONALIZATION_VARS = ['{{first_name}}', '{{last_name}}', '{{company}}', '{{email}}', '{{date}}'];

function TagInput({ label, placeholder, tags, setTags, inputValue, onInputChange }) {
  const [localInput, setLocalInput] = useState('');
  const input = inputValue !== undefined ? inputValue : localInput;
  const setInput = onInputChange !== undefined ? onInputChange : setLocalInput;

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      setTags((t) => [...t, input.trim()]);
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length) {
      setTags((t) => t.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="min-h-[42px] flex flex-wrap gap-1.5 items-center px-3 py-2 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
        {tags.map((t, i) => (
          <span key={i} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-md border border-indigo-100">
            {t}
            <button type="button" onClick={() => setTags((ts) => ts.filter((_, idx) => idx !== i))}>
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="email"
          placeholder={tags.length ? '' : placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={addTag}
          className="flex-1 min-w-28 outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
        />
      </div>
    </div>
  );
}

function SenderDropdown({ senders, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = senders.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSender = senders.find(s => s.email === value) || senders[0];

  return (
    <div className="flex flex-col gap-1 relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-700">From (Registered Sender)</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-50 transition-all text-left"
      >
        <div className="flex-1 truncate pr-2">
          {selectedSender ? (
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-medium whitespace-nowrap">{selectedSender.name}</span>
              <span className="text-gray-500 text-xs truncate">&lt;{selectedSender.email}&gt;</span>
            </div>
          ) : (
            <span className="text-gray-400">Select a sender...</span>
          )}
        </div>
        <ChevronDown size={16} className="text-gray-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-gray-100 relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search senders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border-none rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-gray-500">No senders found.</div>
            ) : (
              filtered.map(s => (
                <button
                  key={s.email}
                  type="button"
                  onClick={() => {
                    onChange(s.email);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-indigo-50 transition-colors text-left ${value === s.email ? 'bg-indigo-50' : ''}`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className={`font-medium ${value === s.email ? 'text-indigo-700' : 'text-gray-900'}`}>{s.name}</span>
                    <span className={`${value === s.email ? 'text-indigo-500' : 'text-gray-500'} text-xs truncate`}>{s.email}</span>
                  </div>
                  {value === s.email && <Check size={16} className="text-indigo-600 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComposePage() {
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [ccVisible, setCcVisible] = useState(false);
  const [bccVisible, setBccVisible] = useState(false);
  const [templateModal, setTemplateModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileRef = useRef();

  const [toTags, setToTags] = useState([]);
  const [toInput, setToInput] = useState('');
  const [ccTags, setCcTags] = useState([]);
  const [ccInput, setCcInput] = useState('');
  const [bccTags, setBccTags] = useState([]);
  const [bccInput, setBccInput] = useState('');
  const [senders, setSenders] = useState([]);

  const [form, setForm] = useState({
    from: user?.email || 'a5d4bf001@smtp-brevo.com',
    replyTo: '',
    subject: '',
  });

  useEffect(() => {
    async function fetchSenders() {
      try {
        const res = await fetch('https://api.brevo.com/v3/senders', {
          headers: {
            'api-key': import.meta.env.VITE_BREVO_API_KEY,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          const activeSenders = (data.senders || []).filter(s => s.active);
          setSenders(activeSenders);
          if (activeSenders.length > 0) {
            setForm(f => {
              const isCurrentValid = activeSenders.some(s => s.email === f.from);
              return isCurrentValid ? f : { ...f, from: activeSenders[0].email };
            });
          }
        }
      } catch (e) {
        console.error('Failed to load senders', e);
      }
    }
    fetchSenders();
  }, []);

  const handleSend = async () => {
    const finalToTags = [...toTags];
    if (toInput.trim()) finalToTags.push(toInput.trim());

    if (!form.subject) return toast.error('Please enter a subject');
    if (!finalToTags.length) return toast.error('Please add at least one recipient in "To" field');
    if (!body) return toast.error('Email body is required');
    setSending(true);
    
    try {
      const payload = {
        sender: { email: form.from || 'noreply@mular.io', name: user?.name || 'Mular User' },
        to: finalToTags.map(t => ({ email: t })),
        subject: form.subject,
        htmlContent: body,
      };

      const finalCcTags = [...ccTags];
      if (ccInput.trim()) finalCcTags.push(ccInput.trim());
      const finalBccTags = [...bccTags];
      if (bccInput.trim()) finalBccTags.push(bccInput.trim());

      if (form.replyTo) payload.replyTo = { email: form.replyTo };
      if (finalCcTags.length) payload.cc = finalCcTags.map(t => ({ email: t }));
      if (finalBccTags.length) payload.bcc = finalBccTags.map(t => ({ email: t }));

      if (attachments.length > 0) {
        const attachArray = await Promise.all(
          attachments.map(async (file) => {
            const base64Data = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result.split(',')[1]);
              reader.onerror = error => reject(error);
            });
            return {
              name: file.name,
              content: base64Data
            };
          })
        );
        payload.attachment = attachArray;
      }

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to send');
      }
      
      const data = await res.json();
      console.log("Email Success ID:", data.messageId);
      toast.success('Email successfully sent');
      
      // Clean outputs after success
      setToInput('');
      setCcInput('');
      setBccInput('');
      setToTags([]);
      setCcTags([]);
      setBccTags([]);
      setAttachments([]);
      setForm(f => ({ ...f, subject: '', replyTo: '' }));
      setBody('');

    } catch (err) {
      toast.error(err.message || 'Internal error while sending');
    }
    setSending(false);
  };

  const handleDraft = async () => {
    setSavingDraft(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavingDraft(false);
    toast.success('Draft saved');
  };

  const handleTestSend = async () => {
    toast.success('Test email sent to ' + (user?.email || 'your email'));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((a) => [...a, ...files]);
  };

  const applyTemplate = (tpl) => {
    setForm((f) => ({ ...f, subject: tpl.subject }));
    setBody(tpl.body);
    setTemplateModal(false);
    toast.success(`Template "${tpl.name}" applied`);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Compose Email</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and send professional emails</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" loading={savingDraft} onClick={handleDraft} icon={Save}>
            Save Draft
          </Button>
          <Button variant="secondary" size="sm" onClick={handleTestSend} icon={TestTube}>
            Test Send
          </Button>
          <Button size="sm" loading={sending} onClick={handleSend} icon={Send}>
            Send Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* Recipients */}
        <Card>
          <CardHeader title="Recipients" description="Add email addresses for this message" />
          <div className="grid gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                {senders.length > 0 ? (
                  <SenderDropdown
                    senders={senders}
                    value={form.from}
                    onChange={(val) => setForm(f => ({ ...f, from: val }))}
                  />
                ) : (
                  <Input
                    label="From"
                    icon={User}
                    value={form.from}
                    onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                    placeholder="sender@company.com"
                  />
                )}
              </div>
              <div className="flex-1">
                <Input
                  label="Reply-To"
                  value={form.replyTo}
                  onChange={(e) => setForm((f) => ({ ...f, replyTo: e.target.value }))}
                  placeholder="replies@company.com"
                />
              </div>
            </div>
            <TagInput label="To" placeholder="Add recipients (press Enter)" tags={toTags} setTags={setToTags} inputValue={toInput} onInputChange={setToInput} />
            <div className="flex gap-2">
              {!ccVisible && (
                <button onClick={() => setCcVisible(true)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                  <Plus size={12} /> Add CC
                </button>
              )}
              {!bccVisible && (
                <button onClick={() => setBccVisible(true)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                  <Plus size={12} /> Add BCC
                </button>
              )}
            </div>
            {ccVisible && <TagInput label="CC" placeholder="CC recipients" tags={ccTags} setTags={setCcTags} inputValue={ccInput} onInputChange={setCcInput} />}
            {bccVisible && <TagInput label="BCC" placeholder="BCC recipients" tags={bccTags} setTags={setBccTags} inputValue={bccInput} onInputChange={setBccInput} />}
          </div>
        </Card>

        {/* Subject & Body */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardHeader title="Message" description="Compose your email content" />
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" icon={Eye} onClick={() => setTemplateModal(true)}>
                Templates
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Subject"
              placeholder="Enter a clear, compelling subject line..."
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />

            {/* Personalization variables */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                <Variable size={12} /> Personalization variables
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PERSONALIZATION_VARS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setBody((b) => b + v)}
                    className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 hover:bg-indigo-100 transition-colors font-mono"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email Body</label>
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                modules={quillModules}
                placeholder="Compose your message here..."
              />
            </div>
          </div>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader
            title="Attachments"
            description="Attach files to your email"
            actions={
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => fileRef.current.click()}>
                Add File
              </Button>
            }
          />
          <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />
          {attachments.length === 0 ? (
            <div
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <Paperclip size={24} className="text-gray-300 group-hover:text-indigo-400 mx-auto mb-2 transition-colors" />
              <p className="text-sm text-gray-400 group-hover:text-indigo-500 transition-colors">
                Drag & drop or click to attach files
              </p>
              <p className="text-xs text-gray-300 mt-1">PDF, DOCX, PNG, JPG up to 25MB</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {attachments.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-sm px-3 py-1.5 rounded-lg">
                  <Paperclip size={13} className="text-gray-400" />
                  <span className="text-gray-700 text-xs">{f.name}</span>
                  <button onClick={() => setAttachments((a) => a.filter((_, idx) => idx !== i))}>
                    <X size={12} className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileRef.current.click()}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 px-2"
              >
                <Plus size={12} /> Add more
              </button>
            </div>
          )}
        </Card>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between py-2">
          <p className="text-xs text-gray-400">All changes are auto-saved</p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" loading={savingDraft} onClick={handleDraft} icon={Save}>
              Save Draft
            </Button>
            <Button variant="secondary" size="sm" onClick={handleTestSend} icon={TestTube}>
              Send Test
            </Button>
            <Button size="md" loading={sending} onClick={handleSend} icon={Send}>
              Send Email
            </Button>
          </div>
        </div>
      </div>

      {/* Template picker modal */}
      <Modal isOpen={templateModal} onClose={() => setTemplateModal(false)} title="Choose a Template" size="lg">
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {mockTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl)}
              className="text-left p-4 border border-gray-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">{tpl.name}</p>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tpl.category}</span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{tpl.subject}</p>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
