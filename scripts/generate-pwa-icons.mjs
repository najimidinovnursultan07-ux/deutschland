import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const icon192Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" rx="40" fill="#0d0e15" />
  <defs>
    <linearGradient id="grad192" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
  </defs>
  <g transform="translate(46, 46)">
    <path d="M10,25 C10,45 35,50 50,75 C50,50 30,35 30,10 Z" fill="url(#grad192)" opacity="0.85" />
    <path d="M90,25 C90,45 65,50 50,75 C50,50 70,35 70,10 Z" fill="url(#grad192)" />
    <path d="M30,45 Q50,25 70,45" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.9" />
    <path d="M50,10 L53,18 L61,18 L55,23 L57,31 L50,26 L43,31 L45,23 L39,18 L47,18 Z" fill="#f59e0b" />
  </g>
</svg>`;

const icon512Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="110" fill="#0d0e15" />
  <defs>
    <linearGradient id="grad512" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="50%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <g transform="translate(106, 106)">
    <path d="M40,100 C40,180 140,210 200,300 C200,200 110,140 110,50 Z" fill="url(#grad512)" opacity="0.8" />
    <path d="M360,100 C360,180 260,210 200,300 C200,200 290,140 290,50 Z" fill="url(#grad512)" />
    <path d="M110,180 Q200,100 290,180" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" />
    <g transform="translate(200, 50) scale(1.5)">
      <path d="M0,-20 L5,-5 L20,-5 L8,5 L12,20 L0,10 L-12,20 L-8,5 L-20,-5 L-5,-5 Z" fill="#f59e0b" />
    </g>
  </g>
</svg>`;

async function generate() {
  await sharp(Buffer.from(icon192Svg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, "icon-192x192.png"));

  await sharp(Buffer.from(icon512Svg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, "icon-512x512.png"));

  console.log("Generated public/icon-192x192.png and public/icon-512x512.png");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
