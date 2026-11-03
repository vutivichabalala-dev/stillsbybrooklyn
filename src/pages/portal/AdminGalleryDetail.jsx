import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useRequireAdmin } from '@/lib/portalGuard';
import PortalNoIndex from '../../components/PortalNoIndex';
import { Upload, Save, ArrowLeft, Trash2, Image as ImageIcon, Star, CheckSquare, Edit3, Heart, MessageCircle, Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUSES = ['Draft', 'Awaiting Selections', 'Selections Received', 'In Editing', 'Final Ready', 'Delivered'];
const SHOOT_TYPES = ['Weddings', 'Corporate', 'Portraits', 'Graduations', 'Other'];

const STATUS_COLORS = {
  'Draft': 'text-white/30 bg-white/5 border-white/10',
  'Awaiting Selections': 'text-blue-400 bg-blue-500/10 border-blue-500/25',
  'Selections Received': 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  'In Editing': 'text-orange-400 bg-orange-500/10 border-orange-500/25',
  'Final Ready': 'text-green-400 bg-green-500/10 border-green-500/25',
  'Delivered': 'text-white/50 bg-white/5 border-white/15',
};

export default function AdminGalleryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useRequireAdmin();

  const [gallery, setGallery] = useState(null);
  const [clients, setClients] = useState([]);
  const [proofImages, setProofImages] = useState([]);
  const [finalImages, setFinalImages] = useState([]);
  const [selections, setSelections] = useState([]);
  const [tab, setTab] = useState('details');
  const [saving, setSaving] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [uploadingFinal, setUploadingFinal] = useState(false);
  const [form, setForm] = useState({});
  const [dataLoading, setDataLoading] = useState(true);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      base44.entities.Gallery.filter({ id }),
      base44.entities.Client.list('-created_date', 200),
      base44.entities.GalleryImage.filter({ gallery_id: id, image_type: 'proof' }, 'sort_order', 500),
      base44.entities.GalleryImage.filter({ gallery_id: id, image_type: 'final' }, 'sort_order', 500),
      base44.entities.ImageSelection.filter({ gallery_id: id }, '-updated_date', 500),
    ]).then(([gals, cls, proofs, finals, sels]) => {
      const g = gals[0];
      if (g) { setGallery(g); setForm(g); }
      setClients(cls);
      setProofImages(proofs);
      setFinalImages(finals);
      setSelections(sels);
    }).finally(() => setDataLoading(false));
  }, [user, id]);

  const handleSave = async () => {
    setSaving(true);
    const updated = await base44.entities.Gallery.update(id, form);
    setGallery(updated);
    setSaving(false);
  };

  const handleUploadImages = async (files, type) => {
    const setter = type === 'proof' ? setUploadingProof : setUploadingFinal;
    setter(true);
    const uploaded = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const img = await base44.entities.GalleryImage.create({
        gallery_id: id,
        image_url: file_url,
        thumbnail_url: file_url,
        filename: file.name,
        image_type: type,
        sort_order: (type === 'proof' ? proofImages : finalImages).length + i,
      });
      uploaded.push(img);
    }
    if (type === 'proof') setProofImages(prev => [...prev, ...uploaded]);
    else setFinalImages(prev => [...prev, ...uploaded]);
    setter(false);
  };

  const handleDeleteImage = async (imgId, type) => {
    await base44.entities.GalleryImage.delete(imgId);
    if (type === 'proof') setProofImages(prev => prev.filter(i => i.id !== imgId));
    else setFinalImages(prev => prev.filter(i => i.id !== imgId));
  };

  const handleSendInvite = async () => {
    const client = clients.find(c => c.id === gallery.client_id);
    if (!client?.email) return;
    setSendingInvite(true);
    try { await base44.users.inviteUser(client.email, 'user'); } catch (e) { /* already registered */ }
    await base44.functions.invoke('portalNotify', {
      type: 'client_invited',
      data: { clientName: client.full_name, clientEmail: client.email, galleryTitle: gallery.title, portalUrl: `${window.location.origin}/portal` },
    });
    await base44.entities.GalleryInvite.create({
      client_id: client.id, gallery_id: gallery.id, invited_email: client.email,
      invite_status: 'sent', invited_at: new Date().toISOString(),
    });
    await base44.entities.Client.update(client.id, { invite_status: 'invited', invited_at: new Date().toISOString() });
    setSendingInvite(false);
    setInviteSent(true);
  };

  const handleStatusChange = async (newStatus) => {
    const updated = await base44.entities.Gallery.update(id, { gallery_status: newStatus });
    setGallery(updated);
    setForm(prev => ({ ...prev, gallery_status: newStatus }));

    // Notify client if gallery is now final ready
    if (newStatus === 'Final Ready') {
      const client = clients.find(c => c.id === gallery.client_id);
      if (client?.email) {
        await base44.functions.invoke('portalNotify', {
          type: 'gallery_ready',
          data: { galleryId: gallery.id },
        });
      }
    }
  };

  if (authLoading || dataLoading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!gallery) return (
    <div className="p-10 text-white/40 font-montserrat text-sm">Gallery not found.</div>
  );

  const TABS = [
    { id: 'details', label: 'Details' },
    { id: 'proofs', label: `Proof Images (${proofImages.length})` },
    { id: 'finals', label: `Final Images (${finalImages.length})` },
    { id: 'selections', label: `Client Selections (${selections.length})` },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <PortalNoIndex />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <Link to="/portal/admin/galleries" className="flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors text-xs font-montserrat uppercase tracking-wider">
          <ArrowLeft size={13} /> Galleries
        </Link>
        <div className="flex-1">
          <h1 className="text-white text-xl font-montserrat font-bold">{gallery.title}</h1>
          <p className="text-white/30 text-xs font-montserrat">
            {clients.find(c => c.id === gallery.client_id)
              ? `${clients.find(c => c.id === gallery.client_id).full_name} · ${clients.find(c => c.id === gallery.client_id).email}`
              : <span className="text-amber-400/70">⚠ No client assigned</span>
            }
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {gallery.client_id && clients.find(c => c.id === gallery.client_id) ? (
            <button onClick={handleSendInvite} disabled={sendingInvite}
              className={`flex items-center gap-2 px-4 py-2 border text-[10px] font-montserrat font-bold uppercase tracking-wider rounded-sm transition-all ${
                inviteSent
                  ? 'border-green-500/30 text-green-400 bg-green-500/10'
                  : 'border-gold/50 text-gold bg-gold/10 hover:bg-gold hover:text-black'
              } disabled:opacity-50`}>
              <Send size={11} /> {sendingInvite ? 'Sending...' : inviteSent ? 'Invite Sent ✓' : 'Send Invite'}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 border border-amber-500/25 text-amber-400/70 text-[10px] font-montserrat uppercase tracking-wider rounded-sm">
              <AlertCircle size={11} /> Assign client to send invite
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => handleStatusChange(s)}
              className={`px-3 py-1.5 rounded-sm border text-[9px] font-montserrat font-bold tracking-wider uppercase transition-all ${
                gallery.gallery_status === s ? STATUS_COLORS[s] : 'border-white/8 text-white/20 hover:border-white/20 hover:text-white/50'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-[10px] font-montserrat font-semibold tracking-wider uppercase border-b-2 transition-all ${
              tab === t.id ? 'border-gold text-gold' : 'border-transparent text-white/30 hover:text-white/60'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* Details tab */}
      {tab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { field: 'title', label: 'Gallery Title', type: 'text' },
            { field: 'event_date', label: 'Event Date', type: 'date' },
            { field: 'description', label: 'Description', type: 'textarea' },
            { field: 'expiry_date', label: 'Expiry Date (optional)', type: 'date' },
          ].map(({ field, label, type }) => (
            <div key={field} className={`flex flex-col gap-2 ${type === 'textarea' ? 'md:col-span-2' : ''}`}>
              <label className="text-white/35 text-[10px] font-montserrat tracking-[0.2em] uppercase">{label}</label>
              {type === 'textarea' ? (
                <textarea rows={3} value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm transition-colors resize-none" />
              ) : (
                <input type={type} value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm transition-colors" />
              )}
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <label className="text-white/35 text-[10px] font-montserrat tracking-[0.2em] uppercase">Shoot Type</label>
            <select value={form.shoot_type || ''} onChange={e => setForm({ ...form, shoot_type: e.target.value })}
              className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 focus:border-gold/40 focus:outline-none rounded-sm transition-colors">
              {SHOOT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/35 text-[10px] font-montserrat tracking-[0.2em] uppercase">Assign Client</label>
            <select value={form.client_id || ''} onChange={e => setForm({ ...form, client_id: e.target.value })}
              className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 focus:border-gold/40 focus:outline-none rounded-sm transition-colors">
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.full_name} — {c.email}</option>)}
            </select>
            {!form.client_id && (
              <p className="text-amber-400/70 text-[10px] font-montserrat flex items-center gap-1">
                <AlertCircle size={10} /> A client must be assigned before sending an invite.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gold/10 border border-gold/50 text-gold text-xs font-montserrat font-bold uppercase tracking-wider rounded-sm hover:bg-gold hover:text-black transition-all disabled:opacity-50">
              <Save size={13} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Proof Images tab */}
      {(tab === 'proofs' || tab === 'finals') && (
        <ImageUploadTab
          images={tab === 'proofs' ? proofImages : finalImages}
          type={tab === 'proofs' ? 'proof' : 'final'}
          uploading={tab === 'proofs' ? uploadingProof : uploadingFinal}
          onUpload={(files) => handleUploadImages(files, tab === 'proofs' ? 'proof' : 'final')}
          onDelete={(imgId) => handleDeleteImage(imgId, tab === 'proofs' ? 'proof' : 'final')}
        />
      )}

      {/* Selections tab */}
      {tab === 'selections' && (
        <SelectionsTab selections={selections} proofImages={proofImages} clients={clients} />
      )}
    </div>
  );
}

function ImageUploadTab({ images, type, uploading, onUpload, onDelete }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) onUpload(files);
  };

  return (
    <div>
      <div className="mb-6">
        <label className={`inline-flex items-center gap-3 px-6 py-3 border text-xs font-montserrat font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
          uploading ? 'border-white/15 text-white/30' : 'border-gold/50 text-gold bg-gold/10 hover:bg-gold hover:text-black'
        }`}>
          <Upload size={13} /> {uploading ? 'Uploading...' : `Upload ${type === 'proof' ? 'Proof' : 'Final'} Images`}
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
        {uploading && (
          <div className="mt-3 flex items-center gap-2 text-white/40 text-xs font-montserrat">
            <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" /> Uploading images...
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-sm">
          <ImageIcon size={24} className="text-white/15 mb-3" />
          <p className="text-white/25 text-sm font-montserrat">No {type} images yet</p>
          <p className="text-white/15 text-xs font-montserrat mt-1">Upload images using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-sm overflow-hidden bg-white/4">
              <img src={img.thumbnail_url || img.image_url} alt={img.filename} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => onDelete(img.id)}
                  className="w-7 h-7 rounded-sm bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectionsTab({ selections, proofImages, clients }) {
  if (selections.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CheckSquare size={24} className="text-white/15 mb-4" />
      <p className="text-white/30 text-sm font-montserrat">No selections yet</p>
      <p className="text-white/15 text-xs font-montserrat mt-1">The client hasn't made any selections.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {selections.map((sel) => {
        const img = proofImages.find(i => i.id === sel.image_id);
        return (
          <div key={sel.id} className="flex items-center gap-4 p-4 bg-white/3 border border-white/8 rounded-sm">
            <div className="w-14 h-14 rounded-sm overflow-hidden bg-white/4 shrink-0">
              {img && <img src={img.thumbnail_url || img.image_url} alt={img.filename} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-xs font-montserrat">{img?.filename || 'Unknown image'}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {sel.is_favorite && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-montserrat font-bold tracking-wider uppercase bg-rose-500/15 text-rose-400 border border-rose-500/25"><Heart size={9} /> Fav</span>}
                {sel.requested_edit && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-montserrat font-bold tracking-wider uppercase bg-blue-500/15 text-blue-400 border border-blue-500/25"><Edit3 size={9} /> Edit</span>}
                {sel.final_pick && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-montserrat font-bold tracking-wider uppercase bg-gold/15 text-gold border border-gold/25"><CheckSquare size={9} /> Final</span>}
              </div>
              {sel.client_comment && (
                <div className="flex items-start gap-1.5 mt-2">
                  <MessageCircle size={10} className="text-white/25 mt-0.5 shrink-0" />
                  <p className="text-white/40 text-[11px] font-montserrat font-light italic">"{sel.client_comment}"</p>
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-white/20 text-[10px] font-montserrat">
                {sel.updated_date ? new Date(sel.updated_date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }) : ''}
              </p>
              {sel.submitted && <span className="text-green-400/70 text-[9px] font-montserrat uppercase tracking-wider">Submitted</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}