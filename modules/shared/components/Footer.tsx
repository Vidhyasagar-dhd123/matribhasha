import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-white">MatriBhasha</h2>
          <p className="mt-3 text-sm text-gray-400">
            Discover knowledge, wisdom, and stories in different languages.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">Popular Books</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">Categories</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-yellow-400 transition"><FaGithub /></a>
            <a href="#" className="hover:text-yellow-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-yellow-400 transition"><FaLinkedin /></a>
            <a href="#" className="hover:text-yellow-400 transition"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MatriBhasha. All rights reserved.
      </div>
    </footer>
  );
}
