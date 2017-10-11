// This is the base router, which provides a few utility endpoints for testing
// Also acts as a parent-router for exposing other router modules

import { join } from "path";
import { Router } from "express";
import * as demoRouter from "./demoRouter";

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

// Import your Router modules to the parent Router here
router.use(demoRouter);

export = router;
