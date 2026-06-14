import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { buildLogoSvg } from "../src/lib/brand/logoMarkSvg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const appDir = path.join(__dirname, "..", "src", "app");

async function generate() {
  const svg = buildLogoSvg({ width: 500 });

  const icon192 = path.join(publicDir, "icon-192x192.png");
  const icon512 = path.join(publicDir, "icon-512x512.png");
  const appIcon = path.join(appDir, "icon.png");
  const appleIcon = path.join(appDir, "apple-icon.png");

  const renderSquare = (size: number) =>
    sharp(Buffer.from(svg))
      .resize(size, size, { fit: "contain", background: "#0a0a0a" })
      .png();

  await renderSquare(192).toFile(icon192);
  await renderSquare(512).toFile(icon512);
  await fs.copyFile(icon512, appIcon);
  await fs.copyFile(icon512, appleIcon);

  console.log("Generated rectangular LinguaBridge logo icons");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
