// pages/api/addSantri.js

import supabase from "@/config/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { idKamar, ...santriData } = req.body;

    try {
      // Cek jumlah santri di kamar
      const { data: currentSantri, error: countError } = await supabase
        .from("santri")
        .select("id")
        .eq("id_kamar", idKamar);

      if (countError) throw countError;

      // Jika kamar sudah penuh, tampilkan error
      if (currentSantri.length >= 4) {
        return res.status(400).json({
          success: false,
          message: "Kamar sudah penuh. Silahkan pilih kamar lain",
        });
      }

      // Tambahkan santri baru ke kamar
      const { data, error: insertError } = await supabase
        .from("santri")
        .insert([{ ...santriData, id_kamar: idKamar }]);

      if (insertError) throw insertError;

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
