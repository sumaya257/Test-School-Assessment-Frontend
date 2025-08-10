import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8">
            <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between md:items-center">

                {/* Brand Section */}
                <div className="mb-6 md:mb-0 text-center md:text-left">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-white hover:text-purple-400 transition-colors duration-300"
                    >
                        Test_School
                    </Link>
                    <p className="mt-2 text-sm text-gray-400">
                        Empowering students with modern assessments & learning tools.
                    </p>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center md:justify-end space-x-4 text-lg">
                    <a href="#" className="hover:text-blue-500 transition-colors duration-300">
                        <FaFacebookF />
                    </a>
                    <a href="#" className="hover:text-sky-400 transition-colors duration-300">
                        <FaTwitter />
                    </a>
                    <a href="#" className="hover:text-pink-500 transition-colors duration-300">
                        <FaInstagram />
                    </a>
                    <a href="#" className="hover:text-blue-600 transition-colors duration-300">
                        <FaLinkedinIn />
                    </a>
                    <a href="#" className="hover:text-red-600 transition-colors duration-300">
                        <FaYoutube />
                    </a>
                    <a href="#" className="hover:text-gray-400 transition-colors duration-300">
                        <FaGithub />
                    </a>
                </div>
            </div>

            {/* Bottom Text */}
            <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Test_School. All rights reserved.
            </div>
        </footer>
    );
}
