import type { NextConfig } from "next";

if (process && process.on) {
    process.removeAllListeners("warning");

    process.on("warning", (warning: NodeJS.ErrnoException & { code?: string }) => {
        // Filtre uniquement le warning lié à Buffer() dans pdf-parse
        if (
            warning.code === "DEP0005" &&
            warning.stack &&
            warning.stack.includes("node_modules/pdf-parse")
        ) {
            return; // On ignore
        }

        // Tous les autres warnings restent visibles
        console.warn(warning.name, warning.message);
    });
}

const nextConfig: NextConfig = {
    /* config options here */
};

export default nextConfig;
