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

        // TODO Load from router modules

        // GET / - Return successful response
        this._instance.get("/", (req, res) => { res.send("Hello World"); });

        // GET /error - throws standard Error, returns Internal Server Error response
        this._instance.get("/error", (req, res) => { throw new Error("Danger Will Robinson!"); });

        // GET /forbidden - throws Forbidden Error, returns Forbidden response
        this._instance.get("/forbidden", (req, res) => { throw new Forbidden("lol nope"); });

        // 404 Not Found
        this._instance.use((req, res, next) => { throw new NotFound(); });

        // Error handler
        this._instance.use((err: HttpError | Error, req, res, next) => {
            if (err instanceof HttpError) {
                // Response with thrown HTTP Errors
                res.status(err.statusCode);
                res.send(err.message);
            } else {
                // Log other Errors and respond with Internal Server Error
                logger.error(err);
                const ise = new InternalServerError();
                res.status(ise.statusCode);
                res.send(ise.message);
            }
        });

        return this._instance;
    }

    // Express application singleton instance
    private static _instance: express.Application;
}
