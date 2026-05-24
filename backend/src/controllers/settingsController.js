import { supabase } from "../../config/supabaseClient.js";
import { uploadBase64ToSupabase } from "../utils/uploadImage.js";

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
  try {
    const { data, error } = await supabase.from('settings').select('*');

    if (error || !data || data.length === 0) {
      return res.status(200).json({ settings: defaultSettings });
    }

    const mergedSettings = { ...defaultSettings };
    data.forEach(item => {
      mergedSettings[item.key] = item.value;
    });

    return res.status(200).json({ settings: mergedSettings });
  } catch (err) {
    return res.status(200).json({ settings: defaultSettings });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    // Upload images to Supabase bucket if they are Base64
    if (settings.hero_image && settings.hero_image.startsWith('data:image')) {
      settings.hero_image = await uploadBase64ToSupabase(settings.hero_image, 'hero');
    }
    
    if (settings.about_image && settings.about_image.startsWith('data:image')) {
      settings.about_image = await uploadBase64ToSupabase(settings.about_image, 'about');
    }

    // Convert object to array of { key, value } to match the SQL schema
    const upsertData = Object.keys(settings).map(key => ({
      key: key,
      value: String(settings[key])
    }));

    const { error } = await supabase
      .from('settings')
      .upsert(upsertData);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Settings berhasil diperbarui!" });
  } catch (err) {
    console.error("Error updating settings:", err);
    return res.status(500).json({ error: err.message });
  }
};

export { getSettings, updateSettings };
