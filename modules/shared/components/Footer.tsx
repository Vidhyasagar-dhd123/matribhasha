import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Globe } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/vivar", label: "Vivar" },
  { href: "/workspace", label: "Workspace" },
  { href: "/dashboard", label: "Dashboard" },
];

const socialLinks = [
  { href: "https://github.com/Vidhyasagar-dhd123/Matribhasha", icon: FaGithub, label: "GitHub" },
  { href: "#", icon: FaTwitter, label: "Twitter" },
  { href: "#", icon: FaLinkedin, label: "LinkedIn" },
  { href: "#", icon: FaInstagram, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Branding */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Globe size={14} />
              </div>
              <h2 className="text-base font-bold tracking-tight text-foreground">Matribhāsha</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Discover knowledge, wisdom, and stories across Indian languages.
              AI-assisted translation for everyone.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-border pt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Matribhāsha. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Breaking language barriers across India.
          </p>
        </div>
      </div>
    </footer>
  );
}
