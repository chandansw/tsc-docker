import "mocha";
import * as assert from "assert";
import * as supertest from "supertest";
import * as mongoose from "mongoose";
import { Application } from "../lib/application";

const DBURL = process.env.DBURL || 'mongodb://localhost:27017/test';

let app = supertest(Application.getInstance());

// Use native promises in Mongoose
(<any>mongoose).Promise = global.Promise;

describe("Country API Routes", () => {

    before(done => {
        mongoose.connect(DBURL, { useMongoClient: true })
            .then(() => done())
            .catch(done);
    });

    after(done => {
        mongoose.disconnect();
        done();
    })

    describe("GET /country", () => {

        xit("should get all Countries", done => {
            app.get("/country")
                .expect(200, { data: [] })
                .end(done);
        });
    });

    describe("POST /country", () => {

        xit("should 400 if required field missing", done => {
            app.get("/country")
                .expect(400, { errors: [] })
                .end(done);
        });

        xit("should add a new Country", done => {
            app.get("/country")
                .expect(200, { data: [] })
                .end(done);
        });
    });

    describe("GET /country/:id", () => {

        xit("should 404 if Country does not exist", done => {
            app.get("/country/foo")
                .expect(404, { errors: [] })
                .end(done);
        });

        xit("should get a single Country", done => {
            app.get("/country/foo")
                .expect(200, { data: [] })
                .end(done);
        });
    });

    describe("POST /country/:id", () => {

        xit("should 404 if Country does not exist", done => {
            app.get("/country/foo")
                .expect(404, { errors: [] })
                .end(done);
        });

        xit("should 400 if required field missing", done => {
            app.get("/country")
                .expect(400, { errors: [] })
                .end(done);
        });

        xit("should update a single Country", done => {
            app.get("/country/foo")
                .expect(200, { data: [] })
                .end(done);
        });
    });

    describe("DELETE /country/:id", () => {

        xit("should 404 if Country does not exist", done => {
            app.get("/country/foo")
                .expect(404, { errors: [] })
                .end(done);
        });

        xit("should delete a single Country", done => {
            app.get("/country/foo")
                .expect(200, { data: [] })
                .end(done);
        });
    });

});
