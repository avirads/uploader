import { serve } from "bun";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

const UPLOAD_DIR = join(import.meta.dir, "uploads");

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR);
}

const server = serve({
    port: process.env.PORT || 3000,
    async fetch(req) {
        const url = new URL(req.url);

        // Serve static files from public/
        if (url.pathname === "/" || url.pathname.includes(".")) {
            const filePath = url.pathname === "/" ? "index.html" : url.pathname;
            const file = Bun.file(join(import.meta.dir, "public", filePath));
            return new Response(file);
        }

        // Handle File Uploads
        if (url.pathname === "/upload" && req.method === "POST") {
            try {
                const formData = await req.formData();
                const files = formData.getAll("files");

                if (!files || files.length === 0) {
                    return new Response(JSON.stringify({ error: "No files uploaded" }), { status: 400 });
                }

                const results = [];

                for (const file of files) {
                    if (!(file instanceof File)) continue;

                    // Requirement 3: Max 10MB per file
                    if (file.size > 10 * 1024 * 1024) {
                        results.push({ name: file.name, status: "rejected", reason: "File too large (> 10MB)" });
                        continue;
                    }

                    // Requirement 5: Allowed types
                    const allowedExts = ["jpg", "jpeg", "png", "doc", "docx", "rtf", "pdf"];
                    const ext = file.name.split(".").pop().toLowerCase();
                    if (!allowedExts.includes(ext)) {
                        results.push({ name: file.name, status: "rejected", reason: "Invalid file type" });
                        continue;
                    }

                    // Determine subfolder based on extension
                    let subfolder = "others";
                    if (["jpg", "jpeg", "png"].includes(ext)) {
                        subfolder = "images";
                    } else if (["doc", "docx", "rtf", "pdf"].includes(ext)) {
                        subfolder = "documents";
                    }

                    const targetDir = join(UPLOAD_DIR, subfolder);
                    if (!existsSync(targetDir)) {
                        mkdirSync(targetDir, { recursive: true });
                    }

                    // Requirement 8: Retain name
                    const filePath = join(targetDir, file.name);
                    await Bun.write(filePath, file);

                    // Requirement 4: Virus scan (Mock logic)
                    // For demonstration, we'll "detect" a virus if the filename contains 'virus'
                    const isInfected = file.name.toLowerCase().includes("virus");

                    if (isInfected) {
                        const { unlinkSync } = await import("fs");
                        unlinkSync(filePath); // Delete if infected
                        results.push({ name: file.name, status: "infected", reason: "Threat detected and removed" });
                    } else {
                        results.push({ name: file.name, status: "success" });
                    }
                }

                return new Response(JSON.stringify({ results }), {
                    headers: { "Content-Type": "application/json" },
                });

            } catch (err) {
                console.error("Upload error:", err);
                return new Response(JSON.stringify({ error: "Server error during upload" }), { status: 500 });
            }
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Server running at http://localhost:${server.port}`);
