import "mocha";
import * as assert from "assert";
import * as supertest from "supertest";
import * as mongoose from "mongoose";
import { Application } from "../lib/application";
import { Country } from "../models/Country";

const DBURL = process.env.DBURL || 'mongodb://localhost:27017/testrunner';

let app = supertest(Application.getInstance());

const reId = /^[a-z0-9]{24}$/;
const reTime = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/;

const response400 = {
    errors: [{
        field: "name",
        message: "Field `name` is required.",
        status: 400
    }]
};

const response404 = {
    errors: [{
        message: "Not Found",
        status: 404,
    }]
};

// Use native promises in Mongoose
(<any>mongoose).Promise = global.Promise;

describe("Country API Routes", () => {

    before(done => {
        mongoose.connect(DBURL, { useMongoClient: true })
            .then(() => mongoose.connection.db.dropDatabase())
            .then(_ => done())
            .catch(done);
    });

    after(done => {
        mongoose.disconnect();
        done();
    })

    describe("GET /country", () => {

        it("should get all Countries", done => {

            Country.insertMany([{ name: "UK" }, { name: "France" }, { name: "Germany" }])
                .then(countries => countries.map(c => JSON.parse(JSON.stringify(c))))
                .then(countries => {
                    app.get("/country")
                        .expect(200, { data: countries })
                        .end(done);
                })
                .catch(done);
        });
    });

    describe("POST /country", () => {

        it("should 400 if required field missing", done => {
            app.post("/country")
                .send({})
                .expect(400, response400)
                .end(done);
        });

        it("should add a new Country", done => {
            app.post("/country")
                .send({ name: "Spain" })
                .expect(200)
                .expect(res => {
                    let country = res.body.data;
                    assert.deepEqual(Object.keys(country).sort(), ['createdAt', 'id', 'name', 'type', 'updatedAt', 'url']);
                    assert.ok(country.id.match(reId));
                    assert.ok(country.createdAt.match(reTime));
                    assert.ok(country.updatedAt.match(reTime));
                    assert.equal(country.type, "Country");
                    assert.equal(country.name, "Spain");
                    assert.equal(country.url, `/country/${country.id}`);
                })
                .end(done);
        });
    });

    describe("GET /country/:id", () => {

        it("should 404 if Country does not exist (valid Object ID)", done => {
            app.get("/country/000000000000000000000000")
                .expect(404, response404)
                .end(done);
        });

        it("should 404 if Country does not exist (invalid Object ID)", done => {
            app.get("/country/000000000000000000000000x")
                .expect(404, response404)
                .end(done);
        });

        it("should get a single Country", done => {
            Country.insertMany([{ name: "United States" }])
                .then(countries => JSON.parse(JSON.stringify(countries[0])))
                .then(country => {
                    app.get(`/country/${country.id}`)
                        .expect(200, { data: country })
                        .end(done);
                })
                .catch(done);
        });
    });

    describe("POST /country/:id", () => {

        it("should 404 if Country does not exist (valid Object ID)", done => {
            app.post("/country/000000000000000000000000")
                .send({})
                .expect(404, response404)
                .end(done);
        });

        it("should 404 if Country does not exist (invalid Object ID)", done => {
            app.post("/country/000000000000000000000000x")
                .send({})
                .expect(404, response404)
                .end(done);
        });

        it("should update a single Country", done => {
            Country.insertMany([{ name: "Burma" }])
                .then(countries => JSON.parse(JSON.stringify(countries[0])))
                .then(country => {
                    app.post(`/country/${country.id}`)
                        .send({ name: "Myanmar" })
                        .expect(200)
                        .expect(res => {
                            let country = res.body.data;
                            assert.deepEqual(Object.keys(country).sort(), ['createdAt', 'id', 'name', 'type', 'updatedAt', 'url']);
                            assert.ok(country.id.match(reId));
                            assert.ok(country.createdAt.match(reTime));
                            assert.ok(country.updatedAt.match(reTime));
                            assert.equal(country.type, "Country");
                            assert.equal(country.name, "Myanmar");
                            assert.equal(country.url, `/country/${country.id}`);
                        })
                        .end(done);
                })
                .catch(done);
        });
    });

    describe("DELETE /country/:id", () => {

        it("should 404 if Country does not exist (valid Object ID)", done => {
            app.delete("/country/000000000000000000000000")
                .expect(404, response404)
                .end(done);
        });

        it("should 404 if Country does not exist (invalid Object ID)", done => {
            app.delete("/country/000000000000000000000000x")
                .expect(404, response404)
                .end(done);
        });

        it("should delete a single Country", done => {
            Country.insertMany([{ name: "North Korea" }])
                .then(countries => JSON.parse(JSON.stringify(countries[0])))
                .then(country => {
                    app.delete(`/country/${country.id}`)
                        .expect(200)
                        .expect(res => {
                            let country = res.body.data;
                            assert.deepEqual(Object.keys(country).sort(), ['createdAt', 'id', 'name', 'type', 'updatedAt', 'url']);
                            assert.ok(country.id.match(reId));
                            assert.ok(country.createdAt.match(reTime));
                            assert.ok(country.updatedAt.match(reTime));
                            assert.equal(country.type, "Country");
                            assert.equal(country.name, "North Korea");
                            assert.equal(country.url, `/country/${country.id}`);
                        })
                        .end(_ => {
                            Country.findById(country.id)
                                .then(doc => assert.strictEqual(doc, null))
                                .then(_ => done())
                                .catch(done)
                        });
                })
                .catch(done);
        });
    });

});
