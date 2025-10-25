import Navbar from "../components/nav/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-[#55b47e]">
        <div className="flex flex-col justify-center items-center h-[calc(100vh-90px)] w-full">
          <div className="flex-title pangolin-regular flex flex-row">
            <p className="uppercase">Grow Local</p>
          </div>

          <div className="flex flex-col justify-center items-start text-lg ml-40">
            <p className="pb-3 pangolin-regular">
              Frontend: React, TypeScript, Tailwind CSS, Vite, Vis.gl, Google
              Maps API, Supercluster, jwt-decode
            </p>
            <p className=" text-center  pb-3 pangolin-regular">
              Backend: Express, MongoDB, Mongoose
            </p>
            <p className=" text-center  pb-3 pangolin-regular">
              Auth & Security: JWT (jsonwebtoken), bcrypt, CORS
            </p>
            <p className=" text-center  pb-3 pangolin-regular">
              Infrastructure & Tools: Google Cloud Storage, Multer, Dotenv
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
