import Navbar from "../components/nav/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-[#55b47e] ubuntu-regular ">
        <div className="flex flex-col justify-center items-center h-[calc(100vh-90px)] w-full">
          <h1 className="flex-title pangolin-regular">
            <p className="uppercase">Grow Local</p>
          </h1>
          <p className="flex-subtitle text-center  pb-3 pangolin-regular">
            React,TypeScript, Tailwind CSS, Vite, Vis.gl, Google Maps API,
            Supercluster,{" "}
          </p>
          <p className="flex-subtitle text-center  pb-3 pangolin-regular">
            Express, MongoDB, Google Cloud Storage, Multer, Cors, Dotenv
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
