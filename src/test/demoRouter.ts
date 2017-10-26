import "mocha";
import * as assert from "assert";
import * as supertest from "supertest";
import { Application } from "../lib/application";

const app = supertest(Application.getInstance());

describe("Basic API Routes", () => {

    describe("GET /ping", () => {

        it("should return a PONG response", done => {
            app.get("/ping")
                .expect(200, "PONG")
                .end(done);
        });
    });

    describe("GET /redir", () => {

        it("should return an HTTP redirect", done => {
            app.get("/redir")
                .expect(302)
                .expect("location", "https://google.com")
                .end(done);
        });
    });

    describe("GET /error", () => {

        it("should return a Server Error", done => {
            app.get("/error")
                .expect("content-type", /json/)
                .expect(500, {
                    error: {
                        status: 500,
                        message: "Internal Server Error"
                    }
                })
                .end(done);
        });
    });

    describe("GET /teapot", () => {

        it("should return an HTTP Error", done => {
            app.get("/teapot")
                .expect("content-type", /json/)
                .expect(418, {
                    error: {

                        status: 418,
                        message: "Not a Coffee Pot"
                    }
                })
                .end(done);
        });
    });

    describe("POST /echo", () => {

        it("should return request data", done => {
            app.post("/echo?foo=bar")
                .send({ fuz: "baz" })
                .expect("content-type", /json/)
                .expect(200)
                .expect(res => assert.ok("headers" in res.body.data))
                .expect(res => assert.deepEqual(res.body.data.body, { fuz: "baz" }))
                .expect(res => assert.deepEqual(res.body.data.method, "POST"))
                .expect(res => assert.deepEqual(res.body.data.path, "/echo"))
                .expect(res => assert.deepEqual(res.body.data.query, { foo: "bar" }))
                .end(done);
        });
    });
});
