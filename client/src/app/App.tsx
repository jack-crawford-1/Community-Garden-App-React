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

          <div className="flex flex-col justify-center items-start text-lg ml-60">
            <p className="pb-3 ">
              <span className="font-semibold">Frontend</span>: React,
              TypeScript, Tailwind CSS, Vite, Vis.gl, Google Maps API,
              Supercluster, jwt-decode
            </p>
            <p className=" text-center  pb-3 ">
              <span className="font-semibold">Backend</span>: Express, MongoDB,
              Mongoose
            </p>
            <p className=" text-center  pb-3 ">
              <span className="font-semibold">Auth & Security</span>: JWT
              (jsonwebtoken), bcrypt, CORS
            </p>
            <p className=" text-center  pb-3 ">
              <span className="font-semibold">Infrastructure & Tools</span>:
              Google Cloud Storage, Multer, Dotenv
            </p>
            <p className=" text-center  pb-3 ">
              <span className="font-semibold">Deployed</span>: Vercel Client,
              Railway API
            </p>
            <a href="/map">
              <button className="mt-10 bg-white hover:bg-[#55b47e] hover:text-white text-green-600 font-bold py-2 px-4 border-b-4 border-green-800 hover:border-white rounded">
                See Gardens
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
