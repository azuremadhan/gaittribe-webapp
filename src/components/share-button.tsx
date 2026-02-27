"use client";

import { Copy, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function ShareButton({ title }: { title: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const whatsappHref = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    [title, url],
  );
  const twitterHref = useMemo(
    () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    [title, url],
  );

  const onCopyForInstagram = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied for Instagram sharing.");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700">
        <MessageCircle size={14} /> WhatsApp
      </a>
      <a href={twitterHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700">
        <Share2 size={14} /> Twitter
      </a>
      <button onClick={onCopyForInstagram} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700">
        <Copy size={14} /> Instagram
      </button>
    </div>
  );
}

