import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-4 text-center">
      <p className="text-xs text-gray-500">
        © {currentYear} Aarush Chaudhary, All rights reserved.
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Disclaimer: This is an AI assistant and not a substitute for professional medical advice. Always consult a doctor.
      </p>
    </footer>
  );
};

export default Footer;
