import * as express from "express";
import * as bodyParser from "body-parser";
import { HttpError, NotFound, InternalServerError, Forbidden } from "http-errors";

const HOST = "0.0.0.0";
const PORT = 8000;
const app: express.Application = express();

// Assign body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log request/response middleware
app.use((req, res, next) => {
    function requestLogger() {
        res.removeListener("finish", requestLogger);
        res.removeListener("close", requestLogger);
        console.log(`${res.statusCode} ${req.method} ${req.url}`);
    }
    res.on("finish", requestLogger);
    res.on("close", requestLogger);
    next();
});

// GET / - Return successful response
app.get("/", (req, res) => { res.send("Hello World"); });

// GET /error - throws standard Error, returns Internal Server Error response
app.get("/error", (req, res) => { throw new Error("Danger Will Robinson!"); });

// GET /forbidden - throws Forbidden Error, returns Forbidden response
app.get("/forbidden", (req, res) => { throw new Forbidden("lol nope"); });

// 404 Not Found
app.use((req, res, next) => { throw new NotFound(); });

// Error handler
app.use((err: HttpError | Error, req, res, next) => {
    if (err instanceof HttpError) {
        // Response with thrown HTTP Errors
        res.status(err.statusCode);
        res.send(err.message);
    } else {
        // Log other Errors and respond with Internal Server Error
        console.error(err);
        const ise = new InternalServerError();
        res.status(ise.statusCode);
        res.send(ise.message);
    }
});

// Serve app
app.listen(PORT, HOST, _ => console.log(`Listening on http://${HOST}:${PORT}`));
