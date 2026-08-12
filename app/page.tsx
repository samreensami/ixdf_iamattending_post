'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, Copy, Check } from 'lucide-react';

export default function BadgeGenerator() {
  const [name, setName] = useState('SAMREEN SAMI');
  const [designation, setDesignation] = useState('LEAD AI ENGINEER');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Suggested Post Caption
  const suggestedCaption = `I’m Attending AI Summit Lahore 2026! 🚀

Excited to be part of AI Summit Lahore, bringing together AI enthusiasts, designers, developers, technology professionals, innovators, students, and industry leaders to learn, connect, and explore the rapidly evolving world of Artificial Intelligence.

📅 Saturday, 22 August 2026
⏰ 3:00 PM – 8:00 PM
📍 University Of Central Punjab UCP Lahore

🎟️ Register: https://luma.com/61rd1xfw
📲 Join WhatsApp Community: https://lnkd.in/dZGU5ZfJ

Organized by @IxDF Pakistan at @University Of Central Punjab UCP Lahore.

#AISummitLahore #AISummit2026 #AI #IxDFPakistan #PakistanTech #LahoreEvents`;

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

const drawText = (
    ctx: CanvasRenderingContext2D,
    currentName: string,
    currentDesignation: string
  ) => {
    // Dynamic Name Position
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText((currentName || 'YOUR NAME').toUpperCase(), 375, 690);

    // Dynamic Designation Position
    ctx.fillStyle = '#D1D5DB';
    ctx.font = '500 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText((currentDesignation || 'YOUR DESIGNATION').toUpperCase(), 375, 735);
  };

  // Main Canvas Rendering Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    const templateImg = new Image();
    templateImg.src = '/templates/template.png';

    templateImg.onload = () => {
      // 1. Draw Template Image
      ctx.drawImage(templateImg, 0, 0, 1080, 1080);

      // 2. Overlay uploaded photo inside the red circle
      if (userImage) {
        const userImgObj = new Image();
        userImgObj.src = userImage;
        userImgObj.onload = () => {
          ctx.save();
          ctx.beginPath();
          
          // Fine-tuned 7px to the left: Center X = 208, Center Y = 705, Radius = 135
          ctx.arc(208, 705, 135, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          // Draw uploaded image centered over updated circle (270x270)
          ctx.drawImage(userImgObj, 73, 570, 270, 270);
          ctx.restore();

          // Render Text
          drawText(ctx, name, designation);
        };
      } else {
        drawText(ctx, name, designation);
      }
    };
  }, [name, designation, userImage]);

  // Download Badge Function
  const downloadBadge = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${(name || 'badge').replace(/\s+/g, '_')}_AI_Summit.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Copy Caption
  const copyCaption = () => {
    navigator.clipboard.writeText(suggestedCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share Handlers
  const shareToLinkedIn = () => {
    copyCaption();
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent("I'm attending AI Summit Lahore 2026! 🚀\n\nOrganized by @IxDFPakistan at UCP Lahore.\n\nGenerate your badge here:");
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareNative = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'AI_Summit_Badge.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'IxDF AI Summit Lahore 2026',
            text: suggestedCaption,
            files: [file],
          });
        } catch (err) {
          console.log('Share canceled', err);
        }
      } else {
        alert('Direct native sharing works on mobile browsers. Download your image first!');
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans">
      <h1 className="text-3xl font-bold mb-8 text-red-500 tracking-wide">
        IxDF AI Summit Badge Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        {/* Controls Panel */}
        <div className="flex flex-col gap-5 justify-center">
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-300">
              1. Upload Your Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-300">
              2. Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="SAMREEN SAMI"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-300">
              3. Designation / Role
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="LEAD AI ENGINEER"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={downloadBadge}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-red-900/30"
          >
            <Download size={20} /> Download High-Res Badge
          </button>

          {/* Social Share Buttons Section */}
          <div className="border-t border-zinc-800 pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-zinc-300">
                4. Share Directly
              </label>
              <button
                onClick={copyCaption}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Caption Copied!' : 'Copy Post Caption'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={shareToLinkedIn}
                className="bg-[#0A66C2] hover:bg-[#084e96] text-white font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                LinkedIn
              </button>
              <button
                onClick={shareToTwitter}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                Twitter (X)
              </button>
              <button
                onClick={shareToFacebook}
                className="bg-[#1877F2] hover:bg-[#1464cc] text-white font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                Facebook
              </button>
              <button
                onClick={shareNative}
                className="bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Share2 size={14} /> Insta / TikTok / Mobile
              </button>
            </div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="flex flex-col items-center justify-center bg-black p-4 rounded-xl border border-zinc-800">
          <canvas
            ref={canvasRef}
            className="w-full max-w-100 h-auto rounded-lg shadow-2xl border border-zinc-800"
          />
          
        </div>
      </div>
    </div>
  );
}