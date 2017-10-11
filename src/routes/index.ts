// This is the base router, which provides a few utility endpoints for testing
// Also acts as a parent-router for exposing other router modules

import { join } from "path";
import { readdirSync } from "fs";
import { Router } from "express";

const router = Router();

/**
 * Responds with project metadata
 * This endpoint is useful to interrogate the status and version of the running service
 */
router.get("/", (req, res) => {
    const metadata = require(join("..", "..", "package.json"));
    res.jsonp({
        data: {
            name: metadata.name,
            version: metadata.version,
            description: metadata.description,
            author: metadata.author,
        }
    });
});

// Dynamically load Router modules from this directory
readdirSync(join("dist", "routes"))
    .filter(file => file !== "index.js" && file.match(/.js$/))
    .forEach(file => router.use(require(`./${file}`)));

export = router;
