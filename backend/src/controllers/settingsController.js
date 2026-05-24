import { supabase } from "../../config/supabaseClient.js";

const defaultSettings = {
  hero_badge: "☕ Artisan · Cozy · Soulful",
  hero_title: "Tempat Kopi yang Bikin Betah",
  hero_desc: "KopiNara hadir untuk mereka yang menghargai kopi berkualitas, suasana hangat, dan momen tenang di tengah hari yang sibuk.",
  hero_image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900",
  stat_variankopi: "40",
  stat_arabikaasli: "100",
  stat_ratingtamu: "5",
  about_image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800",
  about_badge: "Est. 2022",
  about_title: "Dibuat dengan Hati, Diseduh dengan Cinta",
  about_desc: "KopiNara lahir dari kecintaan mendalam terhadap kopi yang sesungguhnya — bukan sekadar minuman, melainkan sebuah pengalaman. Kami memilih biji kopi terbaik dari petani lokal dan menyeduhnya dengan teknik artisan.",
  about_card1_title: "🌱 Kenapa Kopi Kami?",
  about_card1_desc: "Dipetik dari kebun pilihan, dipanggang segar, dan diseduh barista berpengalaman setiap hari.",
  about_card2_title: "🌐 Tujuan Website",
  about_card2_desc: "Landing page ini menampilkan brand KopiNara. Admin dapat mengelola menu via halaman admin.",
  feature1_icon: "☕",
  feature1_title: "Biji Pilihan Terbaik",
  feature1_desc: "Arabika single origin dari petani lokal — fresh roast setiap minggu, rasa selalu konsisten.",
  feature2_icon: "✨",
  feature2_title: "Racikan Barista Ahli",
  feature2_desc: "Setiap minuman dibuat oleh barista terlatih dengan teknik pour-over, espresso, dan cold brew.",
  feature3_icon: "🛋️",
  feature3_title: "Suasana Cozy & Hangat",
  feature3_desc: "Desain interior yang nyaman dengan pencahayaan hangat — tempat ideal untuk kerja atau bersantai.",
  contact_email: "kopinara@example.com",
  contact_instagram: "@kopinara.id",
  contact_location: "Bandung, Indonesia",
  footer_text: "© 2026 KopiNara · Landing Page Frontend React"
};

const getSettings = async (req, res) => {
  if (!supabase) {
    return res.status(200).json({ settings: defaultSettings, error: "Supabase client not initialized" });
  }

  try {
    const { data, error } = await supabase.from('settings').select('*');
    
    if (error) {
      console.warn("Supabase settings error (likely table doesn't exist yet):", error.message);
      return res.status(200).json({ 
        settings: defaultSettings, 
        warning: "Tabel 'settings' belum ada di Supabase. Menampilkan nilai bawaan.",
        sql_hint: "Silakan jalankan SQL berikut di Dashboard Supabase Anda: CREATE TABLE settings (key VARCHAR(255) PRIMARY KEY, value TEXT NOT NULL);"
      });
    }

    const mergedSettings = { ...defaultSettings };
    if (data && data.length > 0) {
      data.forEach(item => {
        mergedSettings[item.key] = item.value;
      });
    }

    return res.status(200).json({ settings: mergedSettings });
  } catch (err) {
    console.error("getSettings critical error:", err);
    return res.status(200).json({ settings: defaultSettings, error: err.message });
  }
};

const updateSettings = async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: "Supabase client is not initialized" });
  }

  try {
    const { settings } = req.body;
    if (!settings) {
      return res.status(400).json({ error: "Data settings tidak ditemukan di request body" });
    }

    const upsertData = Object.keys(settings).map(key => ({
      key: key,
      value: String(settings[key])
    }));

    const { error } = await supabase.from('settings').upsert(upsertData);

    if (error) {
      console.error("Supabase settings upsert error:", error);
      if (error.message.includes('relation "settings" does not exist')) {
        return res.status(400).json({ 
          error: "Tabel 'settings' belum dibuat di Supabase.",
          sql_hint: "Silakan buat tabel 'settings' terlebih dahulu di SQL Editor Supabase Anda dengan query: CREATE TABLE settings (key VARCHAR(255) PRIMARY KEY, value TEXT NOT NULL);"
        });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Settings landing page berhasil diperbarui!" });
  } catch (err) {
    console.error("updateSettings critical error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export { getSettings, updateSettings };
