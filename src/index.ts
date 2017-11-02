// This is the root file for the whole application
// The application is imported and served using submitted arguments

import * as mongoose from "mongoose";
import { argv } from "yargs";
import { Logger } from "./lib/logger";
import { Application } from "./lib/application";

// CLI Arguments
const PORT = argv.port || 1337;
const HOST = argv.host || "0.0.0.0";
const DBURL = argv.DBURL || "mongodb://localhost/test";

// Get Logger instance
const logger = Logger.getInstance();

// Use native promises in Mongoose
(<any>mongoose).Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(DBURL, { useMongoClient: true })
    .then(() => {

        logger.info(`Connected to ${DBURL}`);

        // Get Application instance
        const app = Application.getInstance();

        // Serve application
        app.listen(PORT, HOST, _ => logger.info(`Serving application on http://${HOST}:${PORT}`));
    })
    .catch(logger.error);
