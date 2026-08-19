import { execSync } from "node:child_process";
import type { NextConfig } from "next";

function lastCommitDate() {
  try {
    return execSync("git log -1 --format=%cs", { encoding: "utf8" }).trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function biosFromIso(iso: string) {
  const [year = "0000", month = "00", day = "00"] = iso.split("-");
  return {
    release: `${year.slice(2)}.${month}`,
    version: `${year.slice(2)}.${month}.${day}`,
  };
}

const bios = biosFromIso(lastCommitDate());

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BIOS_RELEASE: bios.release,
    NEXT_PUBLIC_BIOS_VERSION: bios.version,
  },
};

export default nextConfig;
