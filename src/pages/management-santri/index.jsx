//with remove image in bucket
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Space, Table, Pagination } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import supabase from "@/config/supabase";
import Link from "next/link";
import { requireAuth } from "@/utils/auth";

const ManagementSantri = ({ user }) => {
  const router = useRouter();
  const [santri, setSantri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const getSantri = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const start = (page - 1) * size;
      const end = start + size - 1;

      const response = await supabase
        .from("santri")
        .select(
          `
          *,
          kamar: id_kamar (nama_kamar)
        `,
          { count: "exact" }
        )
        .order("id", { ascending: true })
        .range(start, end);

      console.log(response.data);
      setSantri(response?.data ?? []);
      setTotal(response.count);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      // Ambil data santri untuk mendapatkan URL gambar
      const { data: santriData, error: fetchError } = await supabase
        .from("santri")
        .select("imageUrl")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Hapus gambar dari storage jika URL gambar ada
      if (santriData?.imageUrl) {
        const filePath = santriData.imageUrl.split("/").pop(); // Mendapatkan nama file dari URL
        const { error: removeError } = await supabase.storage
          .from("images")
          .remove([filePath]);

        if (removeError) throw removeError;
      }

      // Hapus data santri dari tabel
      const { error: deleteError } = await supabase
        .from("santri")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      getSantri(currentPage, pageSize); // Ambil data santri setelah penghapusan
    } catch (error) {
      console.log("Error deleting data: ", error.message);
    }
  };

  useEffect(() => {
    getSantri(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const goToTambahSantri = () => {
    router.push("/management-santri/tambah-santri");
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  //menyusun ulang ID di tampilan
  const reorganizedSantri = santri.map((item, index) => ({
    ...item,
    displayId: (currentPage - 1) * pageSize + index + 1,
    nama_kamar: item.kamar?.nama_kamar, // Menambahkan nama_kamar
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <h3 className="text-2xl font-bold px-16">Manajemen Santri</h3>
      <div className="flex justify-between items-center px-16">
        <div></div>
        <button
          onClick={goToTambahSantri}
          className="align-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add New
        </button>
      </div>
      <div className="overflow-x-auto mb-8">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-16">
          <Table
            dataSource={reorganizedSantri}
            rowKey="id"
            loading={loading}
            pagination={false}
            onChange={handleTableChange}
          >
            <Table.Column title="ID" dataIndex="displayId" key="displayId" />
            <Table.Column
              title="Nama"
              dataIndex="nama_santri"
              key="nama_santri"
            />
            <Table.Column title="NRA" dataIndex="nra" key="nra" />
            <Table.Column
              title="Jenis Kelamin"
              dataIndex="gender"
              key="gender"
            />
            <Table.Column
              title="Kamar Santri"
              dataIndex="nama_kamar"
              key="nama_kamar"
            />
            <Table.Column
              title="Action"
              key="action"
              render={(text, record) => (
                <Space size="middle">
                  <Link
                    className="font-medium text-blue-600 dark:text-blue-500"
                    href={`/management-santri/edit-santri/${record.id}`}
                  >
                    <EditTwoTone />
                  </Link>

                  <button
                    onClick={() => handleDelete(record.id)}
                    className="font-medium text-red-600 dark:text-red-500"
                  >
                    <DeleteTwoTone twoToneColor="#ff0000" />
                  </button>
                </Space>
              )}
            />
          </Table>
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showLessItems
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return requireAuth(context);
}

export default ManagementSantri;

// //with remove image in bucket
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { Space, Table, Pagination } from "antd";
// import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
// import supabase from "@/config/supabase";
// import Link from "next/link";

// const useAuth = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//     }
//   }, [router]);
// };

// const ManagementSantri = () => {
//   useAuth();
//   const router = useRouter();
//   const [santri, setSantri] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);

//   const getSantri = async (page = 1, size = 10) => {
//     setLoading(true);
//     try {
//       const start = (page - 1) * size;
//       const end = start + size - 1;

//       const response = await supabase
//         .from("santri")
//         .select("*", { count: "exact" })
//         .order("id", { ascending: true })
//         .range(start, end);

//       console.log(response.data);
//       setSantri(response?.data ?? []);
//       setTotal(response.count);
//     } catch (err) {
//       console.log(err);
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Ambil data santri untuk mendapatkan URL gambar
//       const { data: santriData, error: fetchError } = await supabase
//         .from("santri")
//         .select("imageUrl")
//         .eq("id", id)
//         .single();

//       if (fetchError) throw fetchError;

//       // Hapus gambar dari storage jika URL gambar ada
//       if (santriData?.imageUrl) {
//         const filePath = santriData.imageUrl.split("/").pop(); // Mendapatkan nama file dari URL
//         const { error: removeError } = await supabase.storage
//           .from("images")
//           .remove([filePath]);

//         if (removeError) throw removeError;
//       }

//       // Hapus data santri dari tabel
//       const { error: deleteError } = await supabase
//         .from("santri")
//         .delete()
//         .eq("id", id);

//       if (deleteError) throw deleteError;

//       getSantri(currentPage, pageSize); // Ambil data santri setelah penghapusan
//     } catch (error) {
//       console.log("Error deleting data: ", error.message);
//     }
//   };

//   useEffect(() => {
//     getSantri(currentPage, pageSize);
//   }, [currentPage, pageSize]);

//   const goToTambahSantri = () => {
//     router.push("/management-santri/tambah-santri");
//   };

//   const handleTableChange = (pagination) => {
//     setCurrentPage(pagination.current);
//     setPageSize(pagination.pageSize);
//   };

//   //menyusun ulang ID di tampilan
//   const reorganizedSantri = santri.map((item, index) => ({
//     ...item,
//     displayId: (currentPage - 1) * pageSize + index + 1,
//   }));

//   return (
//     <div className="flex flex-col">
//       <h3 className="text-2xl font-bold py-0 px-16">Manajemen Santri</h3>
//       <div className="flex justify-between items-center px-16">
//         <div></div>
//         <button
//           onClick={goToTambahSantri}
//           className="align-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
//         >
//           Add New
//         </button>
//       </div>
//       <div className="overflow-x-auto mb-16">
//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-16">
//           <Table
//             dataSource={reorganizedSantri}
//             rowKey="id"
//             loading={loading}
//             pagination={false}
//             onChange={handleTableChange}
//           >
//             <Table.Column title="ID" dataIndex="displayId" key="displayId" />
//             <Table.Column
//               title="Nama"
//               dataIndex="nama_santri"
//               key="nama_santri"
//             />
//             <Table.Column title="NRA" dataIndex="nra" key="nra" />
//             <Table.Column
//               title="Jenis Kelamin"
//               dataIndex="gender"
//               key="gender"
//             />
//             <Table.Column title="Nomor Kamar" dataIndex="nomor" key="nomor" />
//             <Table.Column
//               title="Action"
//               key="action"
//               render={(text, record) => (
//                 <Space size="middle">
//                   <Link
//                     className="font-medium text-blue-600 dark:text-blue-500"
//                     href={`/management-santri/edit-santri/${record.id}`}
//                   >
//                     <EditTwoTone />
//                   </Link>

//                   <button
//                     onClick={() => handleDelete(record.id)}
//                     className="font-medium text-red-600 dark:text-red-500"
//                   >
//                     <DeleteTwoTone twoToneColor="#ff0000" />
//                   </button>
//                 </Space>
//               )}
//             />
//           </Table>
//           <div className="flex justify-end mt-4">
//             <Pagination
//               current={currentPage}
//               pageSize={pageSize}
//               total={total}
//               onChange={(page, size) => {
//                 setCurrentPage(page);
//                 setPageSize(size);
//               }}
//               showLessItems
//               showSizeChanger={false}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagementSantri;

//without remove image
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { Space, Table, Pagination } from "antd";
// import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
// import supabase from "@/config/supabase";
// import Link from "next/link";

// const useAuth = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//     }
//   }, [router]);
// };

// const ManagementSantri = () => {
//   useAuth();
//   const router = useRouter();
//   const [santri, setSantri] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);

//   const getSantri = async (page = 1, size = 10) => {
//     setLoading(true);
//     try {
//       const start = (page - 1) * size;
//       const end = start + size - 1;

//       const response = await supabase
//         .from("santri")
//         .select("*", { count: "exact" })
//         .order("id", { ascending: true })
//         .range(start, end);

//       console.log(response.data);
//       setSantri(response?.data ?? []);
//       setTotal(response.count);
//     } catch (err) {
//       console.log(err);
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const { error } = await supabase.from("santri").delete().eq("id", id);
//       if (error) throw error;
//       getSantri(currentPage, pageSize); // Ambil data santri setelah penghapusan
//     } catch (error) {
//       console.log("Error deleting data: ", error.message);
//     }
//   };

//   useEffect(() => {
//     getSantri(currentPage, pageSize);
//   }, [currentPage, pageSize]);

//   const goToTambahSantri = () => {
//     router.push("/management-santri/tambah-santri");
//   };

//   const handleTableChange = (pagination) => {
//     setCurrentPage(pagination.current);
//     setPageSize(pagination.pageSize);
//   };

//   // Tambahan untuk menyusun ulang ID di tampilan
//   const reorganizedSantri = santri.map((item, index) => ({
//     ...item,
//     displayId: (currentPage - 1) * pageSize + index + 1,
//   }));

//   return (
//     <div className="flex flex-col">
//       <h3 className="text-2xl font-bold mt-2 mb-2 py-2 px-16">
//         Manajemen Santri
//       </h3>
//       <div className="flex justify-between items-center px-16">
//         <div></div>
//         <button
//           onClick={goToTambahSantri}
//           className="align-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
//         >
//           Add New
//         </button>
//       </div>
//       <div className="overflow-x-auto mb-16">
//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-16">
//           <Table
//             dataSource={reorganizedSantri}
//             rowKey="id"
//             loading={loading}
//             pagination={false}
//             onChange={handleTableChange}
//           >
//             <Table.Column title="ID" dataIndex="displayId" key="displayId" />
//             <Table.Column
//               title="Nama"
//               dataIndex="nama_santri"
//               key="nama_santri"
//             />
//             <Table.Column title="NRA" dataIndex="nra" key="nra" />
//             <Table.Column
//               title="Jenis Kelamin"
//               dataIndex="gender"
//               key="gender"
//             />
//             <Table.Column title="Nomor Kamar" dataIndex="nomor" key="nomor" />
//             <Table.Column
//               title="Action"
//               key="action"
//               render={(text, record) => (
//                 <Space size="middle">
//                   <Link
//                     className="font-medium text-blue-600 dark:text-blue-500"
//                     href={`/management-santri/edit-santri/${record.id}`}
//                   >
//                     <EditTwoTone />
//                   </Link>

//                   <button
//                     onClick={() => handleDelete(record.id)}
//                     className="font-medium text-red-600 dark:text-red-500"
//                   >
//                     <DeleteTwoTone twoToneColor="#ff0000" />
//                   </button>
//                 </Space>
//               )}
//             />
//           </Table>
//           <div className="flex justify-end mt-4">
//             <Pagination
//               current={currentPage}
//               pageSize={pageSize}
//               total={total}
//               onChange={(page, size) => {
//                 setCurrentPage(page);
//                 setPageSize(size);
//               }}
//               showLessItems
//               showSizeChanger={false}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagementSantri;
