import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="  py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Branding */}
        <div>
          <h2 className=" font-bold ">MatriBhasha</h2>
          <p className="mt-3  ">
            Discover knowledge, wisdom, and stories in different languages.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className=" font-semibold  mb-3">Quick Links</h3>
          <ul className="space-y-2 ">
            <li><a href="#" className="hover: transition">Home</a></li>
            <li><a href="#" className="hover: transition">Popular Books</a></li>
            <li><a href="#" className="hover: transition">Categories</a></li>
            <li><a href="#" className="hover: transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className=" font-semibold  mb-3">Follow Us</h3>
          <div className="flex space-x-4 ">
            <a href="#" className="hover: transition"><FaGithub /></a>
            <a href="#" className="hover: transition"><FaTwitter /></a>
            <a href="#" className="hover: transition"><FaLinkedin /></a>
            <a href="#" className="hover: transition"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="  mt-10 pt-5   ">
        © {new Date().getFullYear()} MatriBhasha. All rights reserved.
      </div>
    </footer>
  );
}
