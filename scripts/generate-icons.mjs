import { deflateSync, crc32 } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const DARK = [7, 7, 8];
const LIME = [200, 245, 66];
const FLARE = [255, 122, 74];

function clamp(n) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function roundedBox(px, py, size, radius) {
  const dx = Math.abs(px - size / 2) - (size / 2 - radius);
  const dy = Math.abs(py - size / 2) - (size / 2 - radius);
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(dx, dy), 0) - radius;
}

function coverage(size, x, y, { rounded }) {
  const cx = size * 0.4625;
  const cy = size * 0.5;
  const radius = size * 0.259375;
  const stroke = size * 0.096875;
  const gap = (50 * Math.PI) / 180;
  const pipX = size * 0.7328;
  const pipY = size * 0.5609;
  const pipR = size * 0.0578;

  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx);
  const inGap = Math.abs(ang) < gap;
  const ring = Math.abs(dist - radius) - stroke / 2;
  const aa = 0.55;
  let mark = inGap ? 0 : clamp(0.5 - ring / aa);
  const capR = stroke / 2;
  const ux = cx + radius * Math.cos(-gap);
  const uy = cy + radius * Math.sin(-gap);
  const lx = cx + radius * Math.cos(gap);
  const ly = cy + radius * Math.sin(gap);
  mark = Math.max(
    mark,
    clamp(0.5 - (Math.hypot(x - ux, y - uy) - capR) / aa),
    clamp(0.5 - (Math.hypot(x - lx, y - ly) - capR) / aa),
  );

  const pip = clamp(0.5 - (Math.hypot(x - pipX, y - pipY) - pipR) / aa);
  let bg = 1;
  if (rounded) {
    const box = roundedBox(x, y, size, size * 0.25);
    bg = clamp(0.5 - box / aa);
  }

  return { bg, mark, pip };
}

function raster(size, { rounded }) {
  const sample = size <= 48 ? 8 : 4;
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bg = 0;
      let mark = 0;
      let pip = 0;
      for (let sy = 0; sy < sample; sy++) {
        for (let sx = 0; sx < sample; sx++) {
          const c = coverage(
            size,
            x + (sx + 0.5) / sample,
            y + (sy + 0.5) / sample,
            { rounded },
          );
          bg += c.bg;
          mark += c.mark * c.bg;
          pip += c.pip * c.bg;
        }
      }
      const n = sample * sample;
      bg /= n;
      mark /= n;
      pip /= n;
      let rgb = DARK;
      rgb = mix(rgb, LIME, mark);
      rgb = mix(rgb, FLARE, pip);
      const i = (y * size + x) * 4;
      pixels[i] = rgb[0];
      pixels[i + 1] = rgb[1];
      pixels[i + 2] = rgb[2];
      pixels[i + 3] = Math.round(bg * 255);
    }
  }
  return pixels;
}

function chunk(type, data) {
  const header = Buffer.alloc(8);
  header.writeUInt32BE(data.length, 0);
  header.write(type, 4, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([header.subarray(4, 8), data])));
  return Buffer.concat([header, data, crc]);
}

function encodePng(width, height, pixels) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    pixels.copy(
      raw,
      y * (width * 4 + 1) + 1,
      y * width * 4,
      (y + 1) * width * 4,
    );
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function encodeIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = [];
  const payloads = [];
  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    entry[0] = size < 256 ? size : 0;
    entry[1] = size < 256 ? size : 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    payloads.push(png);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...payloads]);
}

function write(rel, data) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
  console.log(`wrote ${rel} (${data.length} bytes)`);
}

const icoSizes = [16, 32, 48];
const icoImages = icoSizes.map((size) => ({
  size,
  png: encodePng(size, size, raster(size, { rounded: true })),
}));
write("app/favicon.ico", encodeIco(icoImages));

write(
  "app/apple-icon.png",
  encodePng(180, 180, raster(180, { rounded: false })),
);
write(
  "public/icon-192.png",
  encodePng(192, 192, raster(192, { rounded: false })),
);
write(
  "public/icon-512.png",
  encodePng(512, 512, raster(512, { rounded: false })),
);
