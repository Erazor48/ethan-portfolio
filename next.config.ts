import type { NextConfig } from "next";

if (process && process.on) {
    process.removeAllListeners("warning");

    process.on("warning", (warning: NodeJS.ErrnoException & { code?: string }) => {
        if (
            warning.code === "DEP0005" &&
            warning.stack &&
            warning.stack.includes("node_modules/pdf-parse")
        ) {
            return;
        }
        console.warn(warning.name, warning.message);
    });
}

const nextConfig: NextConfig = {
    // Keep these heavy Node.js packages out of the Next.js bundle so they
    // run directly from node_modules at runtime (avoids pdf-parse test-file crash,
    // Tesseract worker paths, etc.)
    serverExternalPackages: ['pdf-parse', 'tesseract.js', 'mammoth', 'exceljs'],
};

export default nextConfig;
