import {
  UserOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import supabase from "@/config/supabase";
import { requireAuth } from "@/utils/auth";

const Dashboard = ({ user }) => {
  const [totalSantri, setTotalSantri] = useState(0);
  const [totalSantriPutra, setTotalSantriPutra] = useState(0);
  const [totalSantriPutri, setTotalSantriPutri] = useState(0);
  const [totalKamar, setTotalKamar] = useState(0);
  const [kamarPenuh, setKamarPenuh] = useState(0);
  const [kamarTersisa, setKamarTersisa] = useState(0);

  useEffect(() => {
    const fetchSantri = async () => {
      try {
        const { data: santriData, error } = await supabase
          .from("santri")
          .select("*");
        if (error) throw error;

        // Menghitung jumlah santri
        setTotalSantri(santriData.length);

        // Menghitung jumlah santri putra dan putri
        const putra = santriData.filter(
          (santri) => santri.gender === "Laki-laki"
        );
        setTotalSantriPutra(putra.length);

        const putri = santriData.filter(
          (santri) => santri.gender === "Perempuan"
        );
        setTotalSantriPutri(putri.length);
      } catch (error) {
        console.error("Error fetching santri data:", error.message);
      }
    };

    const fetchKamar = async () => {
      try {
        const { data: kamarData, error: kamarError } = await supabase
          .from("kamar")
          .select("*");
        if (kamarError) throw kamarError;

        const { data: santriData, error: santriError } = await supabase
          .from("santri")
          .select("id_kamar");
        if (santriError) throw santriError;

        // Menghitung jumlah kamar
        setTotalKamar(kamarData.length);

        // Mengelompokkan santri berdasarkan id_kamar
        const kamarCount = santriData.reduce((acc, { id_kamar }) => {
          acc[id_kamar] = (acc[id_kamar] || 0) + 1;
          return acc;
        }, {});

        // Menghitung jumlah kamar penuh
        const penuhCount = Object.values(kamarCount).filter(
          (count) => count >= 4
        ).length;
        setKamarPenuh(penuhCount);

        // Menghitung jumlah kamar tersisa
        setKamarTersisa(kamarData.length - penuhCount);
      } catch (error) {
        console.error("Error fetching kamar data:", error.message);
      }
    };

    fetchSantri();
    fetchKamar();
  }, []);

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <Row gutter={[24, 24]} className="w-full">
        <Col xs={24} sm={12} md={8}>
          <Card
            className="bg-purple-700 text-white shadow-lg rounded-lg"
            hoverable
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <h5 className="text-lg font-semibold">Jumlah Santri</h5>
                <UserOutlined className="text-4xl mt-2" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{totalSantri}</h2>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="bg-purple-400 text-white shadow-lg rounded-lg"
            hoverable
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <h5 className="text-lg font-semibold">Jumlah Santri Putra</h5>
                <UsergroupAddOutlined className="text-4xl mt-2" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{totalSantriPutra}</h2>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="bg-purple-200 text-gray-800 shadow-lg rounded-lg"
            hoverable
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <h5 className="text-lg font-semibold">Jumlah Santri Putri</h5>
                <UsergroupAddOutlined className="text-4xl mt-2" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{totalSantriPutri}</h2>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="bg-yellow-500 text-white shadow-lg rounded-lg"
            hoverable
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <h5 className="text-lg font-semibold">Jumlah Kamar</h5>
                <HomeOutlined className="text-4xl mt-2" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{totalKamar}</h2>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="bg-yellow-300 text-white shadow-lg rounded-lg"
            hoverable
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <h5 className="text-lg font-semibold">Kamar Penuh</h5>
                <HomeOutlined className="text-4xl mt-2" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{kamarPenuh}</h2>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="bg-yellow-100 text-gray-800 shadow-lg rounded-lg"
            hoverable
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <h5 className="text-lg font-semibold">Kamar Tersisa</h5>
                <HomeOutlined className="text-4xl mt-2" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{kamarTersisa}</h2>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export async function getServerSideProps(context) {
  return requireAuth(context);
}

export default Dashboard;
