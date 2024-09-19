import React from 'react';
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-blue text-white py-4">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          
          <p className="text-sm">
            © {currentYear} Trim | Crafted with care by ASCII DEV.
          </p>
        </div>
        <div className="flex space-x-4">
          <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
            <Twitter size={20} />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
            <Instagram size={20} />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
            <Facebook size={20} />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;