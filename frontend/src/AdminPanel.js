import { useState } from 'react';
import { api } from './api';

function Input({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display:'block', fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', marginBottom:8 }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(212,160,23,0.25)', borderRadius:2, color:'var(--cream)', fontSize:14, fontFamily:'DM Sans,sans-serif', outline:'none' }}
        onFocus={e => e.target.style.borderColor='var(--gold)'}
        onBlur={e  => e.target.style.borderColor='rgba(212,160,23,0.25)'}
      />
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Email dan password wajib diisi'); return; }
    setLoading(true); setError('');
    try {
      const data = await api.login(email, password);
      onLogin(data.token);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth:400, margin:'0 auto', padding:'40px 0' }}>
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
        <h3 style={{ color:'var(--gold)', fontFamily:'Noto Serif SC,serif', fontSize:24 }}>Login Admin</h3>
        <p style={{ color:'rgba(250,246,238,0.5)', fontSize:13, marginTop:8 }}>Masuk untuk mengelola menu restoran</p>
      </div>
      <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="admin@example.com" />
      <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
      {error && (
        <div style={{ background:'rgba(192,57,43,0.2)', border:'1px solid var(--rouge)', padding:'10px 16px', borderRadius:2, color:'#ff8a7a', fontSize:13, marginBottom:16 }}>
          {error}
        </div>
      )}
      <button onClick={handleLogin} disabled={loading} style={{ width:'100%', padding:14, background:'linear-gradient(135deg,var(--rouge),var(--rouge-dark))', color:'var(--gold-light)', border:'1px solid var(--gold)', borderRadius:2, fontSize:13, letterSpacing:2, textTransform:'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'DM Sans,sans-serif', fontWeight:500, opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Memproses...' : 'Login'}
      </button>
    </div>
  );
}

function ItemRow({ item, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 0', borderBottom:'1px solid rgba(212,160,23,0.1)' }}>
      <div style={{ width:48, height:48, borderRadius:2, overflow:'hidden', background:'rgba(212,160,23,0.1)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
        {item.media_url ? <img src={item.media_url} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🥟'}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ color:'var(--cream)', fontWeight:500, fontSize:15 }}>{item.name}</div>
        {item.media_url && <div style={{ color:'rgba(250,246,238,0.3)', fontSize:11, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:200 }}>{item.media_url}</div>}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={() => onEdit(item)} style={{ padding:'6px 14px', background:'rgba(212,160,23,0.15)', color:'var(--gold)', border:'1px solid rgba(212,160,23,0.3)', borderRadius:2, cursor:'pointer', fontSize:12, fontFamily:'DM Sans,sans-serif' }}>Edit</button>
        <button onClick={async () => { setDeleting(true); await onDelete(item.id); setDeleting(false); }} disabled={deleting} style={{ padding:'6px 14px', background:'rgba(192,57,43,0.15)', color:'var(--rouge-light)', border:'1px solid rgba(192,57,43,0.3)', borderRadius:2, cursor: deleting ? 'not-allowed' : 'pointer', fontSize:12, fontFamily:'DM Sans,sans-serif' }}>
          {deleting ? '...' : 'Hapus'}
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel({ onClose }) {
  const [token, setToken]         = useState(null);
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [formMode, setFormMode]   = useState(null);
  const [editItem, setEditItem]   = useState(null);
  const [formName, setFormName]   = useState('');
  const [formMedia, setFormMedia] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchItems = async (t) => {
    setLoading(true);
    try { setItems((await api.getItems(t)) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLogin = (t) => { setToken(t); fetchItems(t); };

  const openCreate = () => { setFormMode('create'); setEditItem(null); setFormName(''); setFormMedia(''); setFormError(''); };
  const openEdit   = (item) => { setFormMode('edit'); setEditItem(item); setFormName(item.name); setFormMedia(item.media_url || ''); setFormError(''); };
  const closeForm  = () => { setFormMode(null); setEditItem(null); };

  const handleSubmit = async () => {
    if (!formName.trim()) { setFormError('Nama item wajib diisi'); return; }
    setFormLoading(true); setFormError('');
    try {
      if (formMode === 'create') await api.createItem(token, { name: formName, media_url: formMedia || null });
      else await api.updateItem(token, editItem.id, { name: formName, media_url: formMedia || null });
      await fetchItems(token);
      closeForm();
    } catch (e) { setFormError(e.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await api.deleteItem(token, id); setItems(prev => prev.filter(i => i.id !== id)); }
    catch (e) { alert('Gagal menghapus: ' + e.message); }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(26,10,0,0.92)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, animation:'fadeIn 0.3s ease' }}>
      <div style={{ background:'linear-gradient(145deg,#1A0A00,#2C1008)', border:'1px solid rgba(212,160,23,0.25)', borderRadius:6, width:'100%', maxWidth:640, maxHeight:'90vh', overflow:'auto', padding:36, position:'relative' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <div>
            <h2 style={{ color:'var(--gold)', fontFamily:'Noto Serif SC,serif', fontSize:22 }}>Panel Admin</h2>
            <p style={{ color:'rgba(250,246,238,0.4)', fontSize:12, marginTop:4 }}>Golden Basket Dimsum</p>
          </div>
          <button onClick={onClose} style={{ background:'rgba(192,57,43,0.2)', border:'1px solid rgba(192,57,43,0.4)', color:'var(--rouge-light)', width:36, height:36, borderRadius:2, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        <div style={{ height:1, background:'linear-gradient(to right,var(--gold),transparent)', marginBottom:32 }}/>

        {!token ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <div>
            {/* Toolbar */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ color:'rgba(250,246,238,0.6)', fontSize:13 }}>{items.length} item terdaftar</div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => fetchItems(token)} style={{ padding:'8px 16px', background:'transparent', color:'var(--gold)', border:'1px solid rgba(212,160,23,0.3)', borderRadius:2, cursor:'pointer', fontSize:12, fontFamily:'DM Sans,sans-serif' }}>↻ Refresh</button>
                <button onClick={openCreate} style={{ padding:'8px 16px', background:'linear-gradient(135deg,var(--rouge),var(--rouge-dark))', color:'var(--gold-light)', border:'1px solid var(--gold)', borderRadius:2, cursor:'pointer', fontSize:12, fontFamily:'DM Sans,sans-serif', letterSpacing:1, textTransform:'uppercase' }}>+ Tambah Item</button>
              </div>
            </div>

            {/* Form */}
            {formMode && (
              <div style={{ background:'rgba(212,160,23,0.05)', border:'1px solid rgba(212,160,23,0.2)', borderRadius:4, padding:24, marginBottom:24 }}>
                <h4 style={{ color:'var(--gold)', marginBottom:20, fontFamily:'Noto Serif SC,serif' }}>
                  {formMode === 'create' ? 'Tambah Item Baru' : `Edit: ${editItem?.name}`}
                </h4>
                <Input label="Nama Item" value={formName} onChange={setFormName} placeholder="Contoh: Hakau Udang" />
                <Input label="URL Gambar (opsional)" value={formMedia} onChange={setFormMedia} placeholder="https://..." />
                {formError && <div style={{ color:'#ff8a7a', fontSize:13, marginBottom:16 }}>{formError}</div>}
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={handleSubmit} disabled={formLoading} style={{ padding:'10px 24px', background:'var(--rouge)', color:'var(--gold-light)', border:'1px solid var(--gold)', borderRadius:2, cursor:'pointer', fontSize:13, fontFamily:'DM Sans,sans-serif' }}>
                    {formLoading ? 'Menyimpan...' : formMode === 'create' ? 'Simpan' : 'Update'}
                  </button>
                  <button onClick={closeForm} style={{ padding:'10px 24px', background:'transparent', color:'rgba(250,246,238,0.5)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:2, cursor:'pointer', fontSize:13, fontFamily:'DM Sans,sans-serif' }}>Batal</button>
                </div>
              </div>
            )}

            {/* List */}
            {loading
              ? <div style={{ textAlign:'center', padding:40, color:'rgba(250,246,238,0.4)' }}>Memuat data...</div>
              : items.length === 0
                ? <div style={{ textAlign:'center', padding:40, color:'rgba(250,246,238,0.4)' }}><div style={{ fontSize:40, marginBottom:12 }}>🥟</div>Belum ada item.</div>
                : items.map(item => <ItemRow key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} />)
            }

            <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid rgba(212,160,23,0.1)' }}>
              <button onClick={() => { setToken(null); setItems([]); }} style={{ background:'none', border:'none', color:'rgba(250,246,238,0.3)', cursor:'pointer', fontSize:12, fontFamily:'DM Sans,sans-serif' }}>← Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
