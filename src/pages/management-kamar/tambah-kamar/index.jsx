import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/config/supabase";
import { requireAuth } from "@/utils/auth";

const TambahKamar = ({ user }) => {
  const router = useRouter();

  const [kamar, setKamar] = useState({
    nama_kamar: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKamar((prev) => ({ ...prev, [name]: value }));
  };

  const handleTambahKamar = async () => {
    try {
      console.log("Data yang dikirim:", kamar);

      // Memasukkan data kamar
      const { data: kamarData, error: kamarError } = await supabase
        .from("kamar")
        .insert([
          {
            nama_kamar: kamar.nama_kamar,
          },
        ])
        .select();

      if (kamarError) throw kamarError;

      console.log("Kamar berhasil ditambahkan:", kamarData);

      router.push("/management-kamar");
    } catch (error) {
      console.error("Error menambahkan kamar:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleTambahKamar();
  };

  return (
    <div className="flex justify-center items-button min-h-screen">
      <div className="w-full max-w-none p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Tambah Kamar
          </h5>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nama Kamar
            </label>
            <input
              type="text"
              name="nama_kamar"
              id="nama_kamar"
              onChange={handleChange}
              value={kamar?.nama_kamar}
              placeholder="Masukan nama kamar"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={!!error}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return requireAuth(context);
}

export default TambahKamar;
