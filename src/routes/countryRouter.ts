import { Router } from "express";
import { NotFound } from "http-errors";
import { Country } from "../models/Country";

function ok(data) {
    if (!data) throw new NotFound();
    return { data: data };
}

const router = Router();

router.get("/country", (req, res, next) => {
    Country.find()
        .then(data => { res.jsonp(ok(data)) })
        .catch(next);
});

router.post("/country", (req, res, next) => {
    new Country(req.body).save()
        .then(data => { res.jsonp(ok(data)) })
        .catch(next);
});

router.get("/country/:id", (req, res, next) => {
    Country.findById(req.params.id)
        .then(data => { res.jsonp(ok(data)) })
        .catch(next);
});

router.post("/country/:id", (req, res, next) => {
    Country.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(data => { res.jsonp(ok(data)) })
        .catch(next);
});

router.delete("/country/:id", (req, res, next) => {
    Country.findByIdAndRemove(req.params.id)
        .then(data => { res.jsonp(ok(data)) })
        .catch(next);
});

export = router;
