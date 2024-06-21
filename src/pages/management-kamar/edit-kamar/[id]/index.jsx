import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import supabase from "@/config/supabase";
import { requireAuth } from "@/utils/auth";

const EditKamar = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;
  const [kamar, setKamar] = useState({
    nama_kamar: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKamar = async () => {
      const { data, error } = await supabase
        .from("kamar")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error fetching kamar:", error.message);
      } else {
        setKamar(data);
      }
    };
    if (id) {
      fetchKamar();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setKamar((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditKamar = async (e) => {
    e.preventDefault();

    if (!kamar.nama_kamar) {
      console.log("Please fill in all fields correctly");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("kamar")
        .update({
          nama_kamar: kamar.nama_kamar,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      console.log("Kamar updated successfully:", data);
      router.push("/management-kamar");
    } catch (error) {
      console.error("Error updating kamar:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-button min-h-screen">
      <div className="w-full max-w-none p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleEditKamar}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit Kamar
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Nama Kamar"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={!!error}
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

export default EditKamar;
