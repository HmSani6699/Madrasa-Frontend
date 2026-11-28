import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const copyTextToClipboard = async (text) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const CopyableMadrasaId = ({ code, variant = "badge", showPrefix = true, className = "" }) => {
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await copyTextToClipboard(code);
      setCopied(true);
      toast.success(`ID copied: ${code}`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  if (variant === "sidebar") {
    return (
      <div className={`inline-flex items-center justify-center gap-1.5 mt-0.5 ${className}`}>
        <span className="text-[14px] font-semibold text-[#EAB33C] tracking-wide select-all">
          {showPrefix ? `ID:${code}` : code}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? "Copied!" : `Copy ${code}`}
          aria-label={`Copy madrasa ID ${code}`}
          className="p-1 rounded-md text-[#EAB33C]/85 hover:text-[#EAB33C] hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono font-semibold ${className}`}
    >
      <span className="select-all">{showPrefix ? `ID: ${code}` : code}</span>
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied!" : `Copy ${code}`}
        aria-label={`Copy madrasa ID ${code}`}
        className="p-0.5 rounded text-emerald-700/80 hover:text-emerald-900 hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </span>
  );
};

export default CopyableMadrasaId;
