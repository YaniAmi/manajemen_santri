export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false, // Jika true, maka akan dianggap sebagai redirect permanen (301)
    },
  };
}

// Komponen ini tidak akan digunakan karena redirect dilakukan di sisi server
export default function Home() {
  return null;
}
