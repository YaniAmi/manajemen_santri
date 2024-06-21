import { useRouter } from "next/router";
import { useState } from "react";
import { createClient } from "../../utils/supabase/component";
import { Alert } from "antd";
import Head from "next/head";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(
        <Alert
          message="Error"
          description="Username atau Password salah"
          type="error"
          showIcon
        />
      );
      console.error(error);
    } else {
      router.push("/");
    }
  }

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=2.0" />
      </Head>
      <div className="flex justify-center items-center h-screen bg-[url('http://www.ppmsubulussalam.ponpes.id/media_library/posts/post-image-1609209026375.jpg')] bg-cover bg-center">
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center">
          {error !== null ? <p className="text-red-500">{error}</p> : null}
        </div>

        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 ">
          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Username
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@gmail.com"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <button
              type="button"
              onClick={logIn}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { Alert } from "antd";

// const useAuth = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//     }
//   }, [router]);
// };

// const Login = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken !== null) {
//       setToken(storedToken);
//     }
//   }, []);

//   useEffect(() => {
//     if (token !== null) {
//       router.push("/dashboard");
//     }
//   }, [token, router]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (
//       formData.email === "admin@gmail.com" &&
//       formData.password === "123456"
//     ) {
//       localStorage.setItem("token", "yani");
//       router.push("/dashboard");
//     } else {
//       setError(
//         <Alert
//           message="Error"
//           description="Username atau Password salah"
//           type="error"
//           showIcon
//         />
//       );
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center">
//         {error !== null ? <p className="error-message">{error}</p> : null}
//       </div>

//       <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               Username
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
//               placeholder="name@gmail.com"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
