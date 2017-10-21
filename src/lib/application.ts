// The main API application instance
// Here middleware are assigned to parse POST data and log request/response info
// Also handlers are assigned for logging and returning errors

import * as express from "express";
import * as bodyParser from "body-parser";
import { HttpError, NotFound, InternalServerError, Forbidden } from "http-errors";
import { Logger } from "./logger";

const logger = Logger.getInstance();

export class Application {

    /**
     * Get/create a singleton HTTP Application instance
     */
    public static getInstance(): express.Application {
        if (this._instance) return this._instance;

        // Create application instance
        this._instance = express();

        // Assign body parser middleware
        this._instance.use(bodyParser.json());
        this._instance.use(bodyParser.urlencoded({ extended: true }));

        // Log request/response middleware
        // Logs the request method, path and response code
        this._instance.use((req, res, next) => {
            function requestLogger() {
                res.removeListener("finish", requestLogger);
                res.removeListener("close", requestLogger);
                logger.info(`${res.statusCode} ${req.method} ${req.url}`);
            }
            res.on("finish", requestLogger);
            res.on("close", requestLogger);
            next();
        });

        // Load router modules
        // impoted here to ensure DB connection is available
        const routes = require("../routes");
        this._instance.use(routes);

        // 404 Not Found
        // If no previous route handler has matched the request, this one is called
        this._instance.use((req, res, next) => { throw new NotFound(); });

        // Error handler
        // This catches any error thrown in the aplication
        // If the error is an HttpError, it is used in the response
        // For all other errors, the error is logs and an Internal Server Error is returned
        this._instance.use((err: HttpError | Error, req, res, next) => {
            if (err instanceof HttpError) {
                // Response with thrown HTTP Errors
                res.status(err.statusCode);
                res.jsonp({ error: { status: err.statusCode, message: err.message } });
            } else {
                // Log other Errors and respond with Internal Server Error
                logger.error(err);
                const ise = new InternalServerError();
                res.status(ise.statusCode);
                res.jsonp({ error: { status: ise.statusCode, message: ise.message } });
            }
        });

        return this._instance;
    }

    // Express application singleton instance
    private static _instance: express.Application;
}
