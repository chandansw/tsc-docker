import * as express from "express";
import * as bodyParser from "body-parser";
import { HttpError, NotFound, InternalServerError } from "http-errors";

const HOST = "0.0.0.0";
const PORT = 8000;
const app: express.Application = express();

// Assign body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint
app.get("/", (req, res, next) => {
    res.send("Hello World");
    next();
});

// 404 Not Found
app.use((req, res, next) => {
    if (!res.headersSent) {
        throw new NotFound();
    }
    next();
});

// Error handler
app.use((err: HttpError, req, res, next) => {
    if (!res.headersSent) {
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
    }
    next();
});

// Request Logger
app.use((req, res) => {
    console.log(`${res.statusCode} ${req.method} ${req.url}`);
});

// Serve app
app.listen(PORT, HOST, _ => console.log(`Listening on http://${HOST}:${PORT}`));
