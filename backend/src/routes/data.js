import express from "express";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { basename, resolve } from "path";
import { logActivity } from "../utils/logger.js";

const router = express.Router({ mergeParams: true });

const generateRandomData = (min = 0, max = 10) => Math.random() * (max - min) + min;

/**
 * Resolves a user-supplied filename against a fixed base directory,
 * strips traversal components via basename(), and verifies the result
 * stays inside the base directory. Returns the safe absolute path or null.
 */
const safePath = (baseRelative, userInput) => {
	const baseDir = resolve(baseRelative);
	const sanitized = basename(userInput);
	const full = resolve(baseDir, sanitized);
	if (!full.startsWith(baseDir)) return null;
	return full;
};

/**
 * Like safePath but allows subdirectory traversal within the base
 * (used by browse-files where the input is a directory path, not a single filename).
 */
const safeDirectoryPath = (baseRelative, userInput) => {
	const baseDir = resolve(baseRelative);
	const full = resolve(baseDir, userInput);
	if (!full.startsWith(baseDir)) return null;
	return full;
};

/**
 * Reads a file from disk and sends it as a response.
 * Centralises the duplicated read-file-and-send pattern.
 */
const serveFile = (res, filePath, { contentType, downloadName, encoding } = {}) => {
	if (!existsSync(filePath)) return false;

	const content = readFileSync(filePath, encoding || undefined);

	if (contentType) res.setHeader("Content-Type", contentType);
	if (downloadName) {
		const safeDownloadName = basename(downloadName);
		res.setHeader("Content-Disposition", `attachment; filename="${safeDownloadName}"`);
	}

	res.send(content);
	return true;
};

router.get("/", async (req, res) => {
	try {
        const quarterlySalesDistribution = {
            Q1: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
            Q2: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
            Q3: Array.from({ length: 100 }, () => generateRandomData(0, 10)),
        };

        const budgetVsActual = {
            January: { budget: generateRandomData(0, 100), actual: generateRandomData(0, 100), forecast: generateRandomData(0, 100) },
            February: { budget: generateRandomData(0, 100), actual: generateRandomData(0, 100), forecast: generateRandomData(0, 100) },
            March: { budget: generateRandomData(0, 100), actual: generateRandomData(0, 100), forecast: generateRandomData(0, 100) },
            April: { budget: generateRandomData(0, 100), actual: generateRandomData(0, 100), forecast: generateRandomData(0, 100) },
            May: { budget: generateRandomData(0, 100), actual: generateRandomData(0, 100), forecast: generateRandomData(0, 100) },
            June: { budget: generateRandomData(0, 100), actual: generateRandomData(0, 100), forecast: generateRandomData(0, 100) },
        };

        const timePlot = {
            projected: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
            actual: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
            historicalAvg: Array.from({ length: 20 }, () => generateRandomData(0, 100)),
        };

        if (res.locals.user && res.locals.user._id) {
            await logActivity(res.locals.user._id, "dashboard_view", "User viewed dashboard");
        }

        return res.json({
            success: true,
            quarterlySalesDistribution,
            budgetVsActual,
            timePlot,
        });
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.get("/download-report", (req, res) => {
	try {
		const { reportName } = req.query;

		if (!reportName) {
			return res.status(400).json({ message: "Report name required" });
		}

		const reportPath = safePath("./reports", reportName);
		if (!reportPath) {
			return res.status(403).json({ message: "Forbidden: Invalid path" });
		}

		if (serveFile(res, reportPath, { downloadName: reportName })) return;

		return res.status(404).json({ message: "Report not found" });
	} catch (error) {
		return res.status(500).json({ message: "Download failed" });
	}
});

router.get("/render-page", (req, res) => {
	try {
		const { template } = req.query;

		if (!template) {
			return res.status(400).json({ message: "Template name required" });
		}

		const templatePath = safePath("./templates", template);
		if (!templatePath) {
			return res.status(403).json({ message: "Forbidden: Invalid path" });
		}

		if (serveFile(res, templatePath, { encoding: "utf8" })) return;

		return res.status(404).json({ message: "Template not found" });
	} catch (error) {
		return res.status(500).json({ message: "Template rendering failed" });
	}
});

router.post("/upload-file", (req, res) => {
	try {
		const { filename, content } = req.body;

		if (!filename || !content) {
			return res.status(400).json({ message: "Filename and content required" });
		}

		const uploadPath = safePath("./uploads", filename);
		if (!uploadPath) {
			return res.status(403).json({ message: "Forbidden: Invalid path" });
		}

		writeFileSync(uploadPath, content);

		return res.json({ 
			success: true, 
			path: uploadPath,
			message: "File uploaded successfully"
		});
	} catch (error) {
		return res.status(500).json({ message: "Upload failed" });
	}
});

router.get("/export-csv", (req, res) => {
	try {
		const { dataFile } = req.query;

		if (!dataFile) {
			return res.status(400).json({ message: "Data file required" });
		}

		if (!basename(dataFile).endsWith(".csv")) {
			return res.status(400).json({ message: "Only CSV files allowed" });
		}

		const csvPath = safePath("./data", dataFile);
		if (!csvPath) {
			return res.status(403).json({ message: "Forbidden: Invalid path" });
		}

		if (serveFile(res, csvPath, { contentType: "text/csv", downloadName: dataFile, encoding: "utf8" })) return;

		return res.status(404).json({ message: "CSV file not found" });
	} catch (error) {
		return res.status(500).json({ message: "Export failed" });
	}
});

router.get("/browse-files", (req, res) => {
	try {
		const { directory } = req.query;

		if (!directory) {
			return res.status(400).json({ message: "Directory required" });
		}

		const dirPath = safeDirectoryPath("./files", directory);
		if (!dirPath) {
			return res.status(403).json({ message: "Forbidden: Path traversal detected" });
		}

		if (existsSync(dirPath)) {
			const files = readdirSync(dirPath);

			const fileList = files.map(file => {
				const filePath = resolve(dirPath, basename(file));
				const stats = statSync(filePath);

				return {
					name: file,
					size: stats.size,
					isDirectory: stats.isDirectory(),
					modified: stats.mtime
				};
			});

			return res.json({ success: true, files: fileList });
		}

		return res.status(404).json({ message: "Directory not found" });
	} catch (error) {
		return res.status(500).json({ message: "Could not list directory" });
	}
});

router.get("/config/load", (req, res) => {
	try {
		const { configFile } = req.query;

		if (!configFile) {
			return res.status(400).json({ message: "Config file required" });
		}

		if (!basename(configFile).endsWith(".json")) {
			return res.status(400).json({ message: "Only JSON config files allowed" });
		}

		const configPath = safePath("./config", configFile);
		if (!configPath) {
			return res.status(403).json({ message: "Forbidden: Invalid path" });
		}

		if (existsSync(configPath)) {
			const config = readFileSync(configPath, "utf8");
			return res.json({ success: true, config: JSON.parse(config) });
		}

		return res.status(404).json({ message: "Config file not found" });
	} catch (error) {
		return res.status(500).json({ message: "Could not load config" });
	}
});

router.post("/generate-custom-report", (req, res) => {
	try {
		const { templateString, data } = req.body;

		if (!templateString) {
			return res.status(400).json({ message: "Template string required" });
		}

		const reportData = data || {
			username: "Unknown",
			date: new Date().toLocaleDateString(),
			totalUsers: 100
		};

		// Safely replace template variables instead of using eval
		const report = templateString.replace(/\$\{(\w+)\}/g, (_, key) => reportData[key] || "");

		return res.json({ 
			success: true, 
			report,
			generatedAt: new Date()
		});
	} catch (error) {
		return res.status(500).json({ message: "Report generation failed" });
	}
});

export default router;
