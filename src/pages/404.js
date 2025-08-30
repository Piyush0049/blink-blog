// pages/404.js
import Link from "next/link";

export default function Custom404() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-center text-white"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-teal-900 bg-opacity-70 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-7xl sm:text-9xl font-extrabold text-teal-300 drop-shadow-lg">
          404
        </h1>
        <p className="mt-4 text-lg sm:text-2xl font-medium text-teal-100 drop-shadow-md">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        <Link
          href="/Home"
          className="mt-8 px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-2xl shadow-lg transition transform hover:scale-105"
        >
          Go Back Home
        </Link>
      </div>

      <div className="absolute -top-10 -left-10 w-60 h-60 bg-teal-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
    </div>
  );
}
