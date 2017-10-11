// This is a demonstration router, showing how to build various API responses
// Use this as a guide when developing your project, but you'll probably want to remove it before publishing

import { Router } from "express";
import { ImATeapot } from "http-errors";

const router = Router();

// To send a simple response string use `res.send()`
router.get("/ping", (req, res) => {
    res.send("PONG");
});

// To redirect clients to another URL use `res.redirect()`
router.get("/redir", (req, res) => {
    res.redirect("https://google.com");
});

// Throwing an error in a handler will cause the error to be logged with a stack trace
// The client will receive a 500 Internal Server Error
router.get("/error", (req, res) => {
    throw new Error("Danger Will Robinson!!!");
});

// Throwing an Error from the "http-errors" module will not be logged with full stack trace
// The client will receive a formatted response of the thrown error
router.get("/teapot", (req, res) => {
    throw new ImATeapot("Not a Coffee Pot");
});

// The Request object contains all the request information
// Use `res.jsonp()` to return a formatted JSON object with optinal JSONP support
//
// try:
//   $ curl --data "foo=bar" "localhost:1337/echo?baz=boz"
//   $ curl --data "foo=bar" "localhost:1337/echo?baz=boz&callback=cb"
//   $ curl --data '{"foo":"bar"}' -H content-type:application/json localhost:1337/echo?baz=boz
//
router.all("/echo", (req, res) => {
    res.jsonp({
        data: {
            method: req.method,
            path: req.path,
            headers: req.headers,
            query: req.query,
            body: req.body,
        }
    });
});

/**
 * Returns a promise which randomly resolves or rejects
 * This is only used to demonstrate how to use Promises in the handlers below
 */
function randomResponse(): Promise<string> {
    return new Promise((resolve, reject) => {
        if (Math.random() > 0.5) {
            resolve("Resolved! 😁");
        } else {
            reject(new Error("Rejected. ☹"));
        }
    });
}

// An example endpoint demonstrating how to use promises in a handler
// This endpoint randomly returns a successful response or throws an error
// Note that it is important to pass errors to the 'next' callback otherwise they will not be handed correctly
router.get("/promise", (req, res, next) => {
    randomResponse()
        .then(msg => res.jsonp({ data: msg }))
        .catch(next);
});

// This example is the same as above, but using the newer async/await syntax
router.get("/async", async (req, res, next) => {
    try {
        res.jsonp({ data: await randomResponse() });
    } catch (err) {
        next(err);
    }
});

export = router;
