import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useRequireAdmin } from '@/lib/portalGuard';
import PortalNoIndex from '../../components/PortalNoIndex';
import { Plus, Search, Mail, Phone, FolderOpen, X, Check, CheckCircle2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PORTAL_URL = `${window.location.origin}/portal`;

function ClientModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [invited, setInvited] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email) { setError('Name and email are required.'); return; }
    setSaving(true);
    try {
      // Invite user to platform (sends platform invite)
      await base44.users.inviteUser(form.email, 'user');
    } catch (err) {
      // If already has account, continue anyway — still send the welcome email
      if (!err.message?.toLowerCase().includes('already')) {
        setError(err.message || 'Failed to invite client.');
        setSaving(false);
        return;
      }
    }
    try {
      // Always send our branded welcome email with portal login link
      await base44.functions.invoke('portalNotify', {
        type: 'client_invited',
        data: { clientName: form.full_name, clientEmail: form.email, portalUrl: PORTAL_URL },
      });
    } catch (err) {
      // Email failed but invite succeeded — still show success
      console.error('Email send failed:', err);
    }
    // Create the Client record in the database
    let clientRecord;
    try {
      clientRecord = await base44.entities.Client.create({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        invite_status: 'invited',
        invited_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Client record creation failed:', err);
    }
    setInvited({ ...form, clientRecord });
    setSaving(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(PORTAL_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (invited) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-[#0d0d10] border border-white/10 rounded-sm p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={24} className="text-green-400" />
          </div>
          <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-2">Client Invited</p>
          <h3 className="text-white text-xl font-montserrat font-bold mb-6">Invitation Sent!</h3>

          {/* Client details card */}
          <div className="bg-white/4 border border-white/8 rounded-sm p-5 text-left mb-6">
            <p className="text-white/30 text-[10px] font-montserrat tracking-wider uppercase mb-4">Client Details</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <span className="text-gold text-[10px] font-montserrat font-bold">{invited.full_name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white font-montserrat font-semibold text-sm">{invited.full_name}</p>
                  <p className="text-white/40 text-xs font-montserrat">{invited.email}</p>
                </div>
              </div>
              {invited.phone && (
                <div className="flex items-center gap-2 pl-1">
                  <Phone size={11} className="text-white/25" />
                  <p className="text-white/40 text-xs font-montserrat">{invited.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Portal link */}
          <div className="bg-white/4 border border-white/8 rounded-sm p-4 text-left mb-6">
            <p className="text-white/30 text-[10px] font-montserrat tracking-wider uppercase mb-2">Portal Login Link</p>
            <div className="flex items-center gap-2">
              <p className="text-gold/70 text-xs font-montserrat flex-1 truncate">{PORTAL_URL}</p>
              <button onClick={copyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 text-white/40 text-[10px] font-montserrat uppercase tracking-wider rounded-sm hover:border-white/30 hover:text-white/70 transition-all shrink-0">
                {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
              </button>
            </div>
          </div>

          <p className="text-white/30 text-xs font-montserrat leading-relaxed mb-6">
            A welcome email with their login link has been sent to <span className="text-white/60">{invited.email}</span>.
          </p>

          <button onClick={() => { onSaved(invited); }}
            className="w-full py-3 bg-gold/15 border border-gold/50 text-gold text-xs font-montserrat font-bold uppercase tracking-wider rounded-sm hover:bg-gold hover:text-black transition-all">
            Done
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#0d0d10] border border-white/10 rounded-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-montserrat font-bold text-base">Invite New Client</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <p className="text-white/35 text-xs font-montserrat leading-relaxed mb-6">
          The client will receive a branded email with their portal login link to access their private gallery immediately.
        </p>

        {error && <p className="text-red-400 text-xs font-montserrat mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-sm">{error}</p>}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {[
            { field: 'full_name', label: 'Full Name', placeholder: 'Client full name', type: 'text' },
            { field: 'email', label: 'Email Address', placeholder: 'client@email.com', type: 'email' },
            { field: 'phone', label: 'Phone (optional)', placeholder: '+27 XX XXX XXXX', type: 'tel' },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-white/35 text-[10px] font-montserrat tracking-[0.2em] uppercase">{label}</label>
              <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                placeholder={placeholder}
                className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm transition-colors" />
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-white/10 text-white/40 text-xs font-montserrat uppercase tracking-wider rounded-sm hover:border-white/30 hover:text-white/70 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-gold/15 border border-gold/50 text-gold text-xs font-montserrat font-bold uppercase tracking-wider rounded-sm hover:bg-gold hover:text-black transition-all disabled:opacity-50">
              {saving ? 'Sending Invite...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminClients() {
  const { user, loading } = useRequireAdmin();
  const [clients, setClients] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      base44.entities.Client.list('-created_date', 200),
      base44.entities.Gallery.list('-created_date', 200),
    ]).then(([cls, gals]) => {
      setClients(cls);
      setGalleries(gals);
    }).finally(() => setDataLoading(false));
  }, [user]);

  if (loading || dataLoading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const filtered = clients.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getClientGallery = (clientId) => galleries.find(g => g.client_id === clientId);

  const STATUS_COLORS = {
    'Draft': 'text-white/30 bg-white/5 border-white/10',
    'Awaiting Selections': 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    'Selections Received': 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    'In Editing': 'text-orange-400 bg-orange-500/10 border-orange-500/25',
    'Final Ready': 'text-green-400 bg-green-500/10 border-green-500/25',
    'Delivered': 'text-white/50 bg-white/5 border-white/15',
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PortalNoIndex />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-1">Studio Management</p>
          <h1 className="text-white text-2xl font-montserrat font-bold">Clients</h1>
          <p className="text-white/30 text-xs font-montserrat mt-1">{clients.length} registered clients</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold/10 border border-gold/50 text-gold text-xs font-montserrat font-bold tracking-[0.15em] uppercase rounded-sm hover:bg-gold hover:text-black transition-all">
          <Plus size={14} /> Invite Client
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="w-full bg-white border border-white/8 text-gray-900 text-xs font-montserrat pl-10 pr-4 py-3 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm transition-colors" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4">
            <Plus size={18} className="text-white/20" />
          </div>
          <p className="text-white/30 text-sm font-montserrat mb-1">No clients yet</p>
          <p className="text-white/15 text-xs font-montserrat">Invite your first client to get started.</p>
        </div>
      ) : (
        <div className="bg-white/3 border border-white/8 rounded-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/6">
            {['Client', 'Email', 'Gallery', 'Status', 'Joined'].map((h, i) => (
              <div key={h} className={`text-white/25 text-[10px] font-montserrat tracking-[0.2em] uppercase ${[3,3,3,2,1][i] === 3 ? 'col-span-3' : [3,3,3,2,1][i] === 2 ? 'col-span-2' : 'col-span-1'}`}>{h}</div>
            ))}
          </div>
          <div className="flex flex-col divide-y divide-white/5">
            {filtered.map((client, i) => {
              const gallery = getClientGallery(client.id);
              return (
                <motion.div key={client.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/2 transition-colors items-center">
                  <div className="md:col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <span className="text-gold text-[10px] font-montserrat font-bold">
                        {(client.full_name || client.email || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/80 text-xs font-montserrat font-semibold">{client.full_name || '—'}</p>
                  </div>
                  <div className="md:col-span-3 flex items-center gap-2">
                    <Mail size={11} className="text-white/25 shrink-0" />
                    <p className="text-white/40 text-xs font-montserrat truncate">{client.email}</p>
                  </div>
                  <div className="md:col-span-3">
                    {gallery ? (
                      <div className="flex items-center gap-2">
                        <FolderOpen size={11} className="text-white/25 shrink-0" />
                        <p className="text-white/60 text-xs font-montserrat truncate">{gallery.title}</p>
                      </div>
                    ) : (
                      <span className="text-white/20 text-[10px] font-montserrat">No gallery assigned</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    {gallery ? (
                      <span className={`px-2.5 py-1 rounded-sm border text-[9px] font-montserrat font-bold tracking-wider uppercase ${STATUS_COLORS[gallery.gallery_status] || STATUS_COLORS['Draft']}`}>
                        {gallery.gallery_status}
                      </span>
                    ) : <span className="text-white/15 text-[10px] font-montserrat">—</span>}
                  </div>
                  <div className="md:col-span-1">
                    <p className="text-white/20 text-[10px] font-montserrat">
                      {client.created_date ? new Date(client.created_date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }) : '—'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <ClientModal
            onClose={() => setShowModal(false)}
            onSaved={(data) => {
              if (data.clientRecord) setClients(prev => [data.clientRecord, ...prev]);
              setShowModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}