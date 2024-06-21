import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Space, Table, Pagination } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import supabase from "@/config/supabase";
import Link from "next/link";
import { requireAuth } from "@/utils/auth";
import { Modal } from "antd";

const ManagementKamar = ({ user }) => {
  const router = useRouter();
  const [kamar, setKamar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const getKamar = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const start = (page - 1) * size;
      const end = start + size - 1;

      // Ambil data kamar
      const {
        data: kamarData,
        error: kamarError,
        count,
      } = await supabase
        .from("kamar")
        .select("*", { count: "exact" })
        .order("id", { ascending: true })
        .range(start, end);

      if (kamarError) throw kamarError;

      // Ambil data santri
      const { data: santriData, error: santriError } = await supabase
        .from("santri")
        .select("id_kamar");

      if (santriError) throw santriError;

      // Hitung jumlah santri per kamar
      const santriCountMap = santriData.reduce((acc, santri) => {
        if (!acc[santri.id_kamar]) {
          acc[santri.id_kamar] = 0;
        }
        acc[santri.id_kamar] += 1;
        return acc;
      }, {});

      // Gabungkan data kamar dengan jumlah santri
      const combinedData = kamarData.map((kamar) => {
        return {
          ...kamar,
          jumlah_santri: santriCountMap[kamar.id] || 0,
        };
      });

      setKamar(combinedData);
      setTotal(count);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      // Hapus data kamar dari tabel
      const { error: deleteError } = await supabase
        .from("kamar")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      getKamar(currentPage, pageSize); // Ambil data kamar setelah penghapusan
    } catch (error) {
      console.log("Error deleting data: ", error.message);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    getKamar(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const goToTambahKamar = () => {
    router.push("/management-kamar/tambah-kamar");
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Menyusun ulang ID di tampilan
  const reorganizedKamar = kamar.map((item, index) => ({
    ...item,
    displayId: (currentPage - 1) * pageSize + index + 1,
  }));

  return (
    <div>
      <Modal
        title="Error"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Kamar digunakan. Harap pindahkan santri terlebih dahulu</p>
      </Modal>
      <div className="flex flex-col min-h-screen">
        <h3 className="text-2xl font-bold px-16">Manajemen Kamar</h3>
        <div className="flex justify-between items-center px-16">
          <div></div>
          <button
            onClick={goToTambahKamar}
            className="align-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add New
          </button>
        </div>
        <div className="overflow-x-auto mb-8">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-16">
            <Table
              dataSource={reorganizedKamar}
              rowKey="id"
              loading={loading}
              pagination={false}
              onChange={handleTableChange}
            >
              <Table.Column title="ID" dataIndex="displayId" key="displayId" />
              <Table.Column
                title="Nama"
                dataIndex="nama_kamar"
                key="nama_kamar"
              />
              <Table.Column
                title="Jumlah Santri"
                dataIndex="jumlah_santri"
                key="jumlah_santri"
              />
              <Table.Column
                title="Action"
                key="action"
                render={(text, record) => (
                  <Space size="middle">
                    <Link
                      className="font-medium text-blue-600 dark:text-blue-500"
                      href={`/management-kamar/edit-kamar/${record.id}`}
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
    </div>
  );
};

export async function getServerSideProps(context) {
  return requireAuth(context);
}

export default ManagementKamar;

// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { Space, Table, Pagination } from "antd";
// import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
// import supabase from "@/config/supabase";
// import Link from "next/link";
// import { requireAuth } from "@/utils/auth";

// const ManagementKamar = ({ user }) => {
//   const router = useRouter();
//   const [kamar, setKamar] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);

//   const getKamar = async (page = 1, size = 10) => {
//     setLoading(true);
//     try {
//       const start = (page - 1) * size;
//       const end = start + size - 1;

//       const response = await supabase
//         .from("kamar")
//         .select("*", { count: "exact" })
//         .order("id", { ascending: true })
//         .range(start, end);

//       console.log(response.data);
//       setKamar(response?.data ?? []);
//       setTotal(response.count);
//     } catch (err) {
//       console.log(err);
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Hapus data santri dari tabel
//       const { error: deleteError } = await supabase
//         .from("kamar")
//         .delete()
//         .eq("id", id);

//       if (deleteError) throw deleteError;

//       getKamar(currentPage, pageSize); // Ambil data santri setelah penghapusan
//     } catch (error) {
//       console.log("Error deleting data: ", error.message);
//     }
//   };

//   useEffect(() => {
//     getKamar(currentPage, pageSize);
//   }, [currentPage, pageSize]);

//   const goToTambahKamar = () => {
//     router.push("/management-kamar/tambah-kamar");
//   };

//   const handleTableChange = (pagination) => {
//     setCurrentPage(pagination.current);
//     setPageSize(pagination.pageSize);
//   };

//   //menyusun ulang ID di tampilan
//   const reorganizedKamar = kamar.map((item, index) => ({
//     ...item,
//     displayId: (currentPage - 1) * pageSize + index + 1,
//   }));

//   return (
//     <div className="flex flex-col min-h-screen">
//       <h3 className="text-2xl font-bold px-16">Manajemen Kamar</h3>
//       <div className="flex justify-between items-center px-16">
//         <div></div>
//         <button
//           onClick={goToTambahKamar}
//           className="align-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
//         >
//           Add New
//         </button>
//       </div>
//       <div className="overflow-x-auto mb-8">
//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-16">
//           <Table
//             dataSource={reorganizedKamar}
//             rowKey="id"
//             loading={loading}
//             pagination={false}
//             onChange={handleTableChange}
//           >
//             <Table.Column title="ID" dataIndex="displayId" key="displayId" />
//             <Table.Column
//               title="Nama"
//               dataIndex="nama_kamar"
//               key="nama_kamar"
//             />

//             <Table.Column
//               title="Action"
//               key="action"
//               render={(text, record) => (
//                 <Space size="middle">
//                   <Link
//                     className="font-medium text-blue-600 dark:text-blue-500"
//                     href={`/management-kamar/edit-kamar/${record.id}`}
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

// export async function getServerSideProps(context) {
//   return requireAuth(context);
// }

// export default ManagementKamar;
