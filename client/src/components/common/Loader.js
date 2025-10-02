import React from 'react';

const Loader = () => (
  <div className="flex items-center space-x-2">
      {/* Loader dots using one of your dark accent colors */}
      <span className="h-2 w-2 bg-[#58595b] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 bg-[#58595b] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 bg-[#58595b] rounded-full animate-bounce"></span>
  </div>
);

export default Loader;
