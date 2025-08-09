import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen  flex flex-col justify-center items-center px-6">
      <div className="max-w-4xl text-center text-white">
        <h1 className="text-4xl font-extrabold mb-6 tracking-wide">
          Welcome to <span className="text-purple-500">Test_School</span> Platform
        </h1>
        <p className="mb-10 text-gray-300 text-lg">
          Your gateway to mastering skills and taking competency tests.
        </p>
        <div className="space-x-6">
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-md text-white font-semibold transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block px-6 py-3 border border-gray-600  hover:bg-gray-900 hover:text-white rounded-md text-gray-400 font-semibold transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
