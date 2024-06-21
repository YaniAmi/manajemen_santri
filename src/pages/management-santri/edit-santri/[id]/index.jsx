import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import supabase from "@/config/supabase";
import { nanoid } from "nanoid";
import { requireAuth } from "@/utils/auth";

const EditSantri = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;

  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [kamarList, setKamarList] = useState([]);
  const [santri, setSantri] = useState({
    nama_santri: "",
    nra: "",
    gender: "",
    id_kamar: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchSantri = async () => {
      const { data, error } = await supabase
        .from("santri")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error fetching santri:", error.message);
      } else {
        setSantri(data);
      }
    };

    const fetchKamar = async () => {
      const { data, error } = await supabase.from("kamar").select();
      if (error) {
        console.error("Error fetching kamar:", error.message);
      } else {
        setKamarList(data);
      }
    };

    if (id) {
      fetchSantri();
      fetchKamar();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSantri((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const filename = nanoid();

      const { data, error } = await supabase.storage
        .from("images")
        .upload(
          `${filename}.${selectedFile.name.split(".").pop()}`,
          selectedFile
        );

      if (error) {
        console.error("Error uploading file:", error.message);
        return null;
      } else {
        const { data: file } = await supabase.storage
          .from("images")
          .getPublicUrl(data?.path);
        return file?.publicUrl; // Mengembalikan URL gambar yang diunggah
      }
    }
    return null;
  };

  const handleEditSantri = async (e) => {
    e.preventDefault();

    // Memeriksa apakah semua field telah diisi
    if (
      !santri.nama_santri ||
      !santri.nra ||
      !santri.gender ||
      !santri.id_kamar
    ) {
      console.log("Please fill in all fields correctly");
      return;
    }

    let imageUrl = santri.imageUrl;
    if (selectedFile) {
      imageUrl = await handleUpload();
    }

    // Melakukan update data santri ke database
    const { data, error } = await supabase
      .from("santri")
      .update({ ...santri, imageUrl })
      .eq("id", id);

    if (error) {
      console.error("Error updating santri:", error.message);
    } else {
      console.log("Santri updated successfully:", data);
      router.push("/management-santri");
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-none p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleEditSantri}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit Santri
          </h5>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nama
            </label>
            <input
              type="text"
              name="nama_santri"
              id="nama_santri"
              onChange={handleChange}
              value={santri?.nama_santri}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Nama Santri"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              No. Registrasi
            </label>
            <input
              type="text"
              name="nra"
              id="nra"
              onChange={handleChange}
              value={santri?.nra}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="NRA"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Jenis Kelamin
            </label>
            <select
              name="gender"
              id="gender"
              onChange={handleChange}
              value={santri?.gender}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Kamar
            </label>
            <select
              name="id_kamar"
              id="id_kamar"
              onChange={handleChange}
              value={santri?.id_kamar}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            >
              <option value="">Pilih Kamar</option>
              {kamarList.map((kamar) => (
                <option key={kamar?.id} value={kamar?.id}>
                  {kamar?.nama_kamar}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              type="file"
              ref={inputRef}
              onChange={(e) => setSelectedFile(e?.target?.files?.[0])}
            />
          </div>
          {santri?.imageUrl && (
            <img
              className="rounded-full w-40 h-40 mt-4"
              src={santri?.imageUrl}
              alt="Santri Image"
            />
          )}
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return requireAuth(context);
}

export default EditSantri;
