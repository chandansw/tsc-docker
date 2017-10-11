import * as bunyan from "bunyan";
import { join } from "path";

export class Logger {

    /**
     * Get/create the singleton logger instance
     * @param options Optional object of bunyan options
     */
    public static getInstance(options: Partial<bunyan.LoggerOptions> = {}): bunyan {
        if (this._instance) return this._instance;

        // Project metadata
        const metadata = require(join("..", "..", "package.json"));

        // Additional options
        options.name = metadata.name;
        options.version = metadata.version;
        options.level = process.env.LOG_LEVEL as bunyan.LogLevel || "trace";

        // Create and return logger
        return (this._instance = new bunyan(options as bunyan.LoggerOptions));
    }

    // Bunyan logger singleton instance
    private static _instance: bunyan;
}

const logger = Logger.getInstance();
