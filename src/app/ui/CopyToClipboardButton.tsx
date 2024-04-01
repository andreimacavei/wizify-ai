'use client'
import { useState } from "react";
import copy from "copy-to-clipboard";

const CopyToClipboardButton = ({ scriptText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(scriptText);
    setCopied(true);
  };
  return (
    <div>
      <button
        onClick={handleCopy}
        className="px-4 py-2 text-white bg-teal-500 rounded hover:bg-teal-600 focus:outline-none focus:ring"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default CopyToClipboardButton;