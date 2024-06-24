import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import supabase from "@/config/supabase";
import { requireAuth } from "@/utils/auth";
import { nanoid } from "nanoid";
import { Modal } from "antd";

const TambahSantri = ({ user }) => {
  const router = useRouter();
  const inputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [kamarList, setKamarList] = useState([]);

  const [santri, setSantri] = useState({
    nama_santri: "",
    nra: "",
    gender: "",
    id_kamar: "",
    imageUrl: null,
  });

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
        console.log(file);
        return file?.publicUrl; // Mengembalikan URL gambar yang diunggah
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchKamar = async () => {
      const { data, error } = await supabase.from("kamar").select();
      if (error) {
        console.error("Error fetching kamar:", error.message);
      } else {
        setKamarList(data);
      }
    };
    fetchKamar();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSantri((prev) => ({ ...prev, [name]: value }));
  };

  const handleTambahSantri = async (imageUrl) => {
    try {
      const response = await fetch("/api/addSantri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...santri,
          idKamar: santri.id_kamar,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      console.log("Santri berhasil ditambahkan:", data);
      router.push("/management-santri");
    } catch (error) {
      console.error("Error menambahkan santri:", error.message);
      setErrorMessage(error.message);
      setIsModalOpen(true); // Tampilkan modal ketika ada error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await handleUpload(); // Tunggu sampai upload selesai
    if (imageUrl) {
      await handleTambahSantri(imageUrl); // Tambahkan santri setelah gambar diunggah
    }
  };

  return (
    <div>
      <Modal
        title="Error"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>{errorMessage}</p>
      </Modal>
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-none p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              Tambah Santri
            </h5>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nama Santri
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
                NOMOR REGISTRASI SANTRI
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
                  <option key={kamar.id} value={kamar.id}>
                    {kamar.nama_kamar}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h1
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="user_avatar"
              >
                Tambahkan Foto
              </h1>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="user_avatar_help"
                id="user_avatar"
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Tambah
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return requireAuth(context);
}

export default TambahSantri;
