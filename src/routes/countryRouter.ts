import { Router } from "express";
import { Country } from "../models/Country";

const router = Router();

router.get("/country", (req, res, next) => {
    Country.findAll()
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

router.post("/country", (req, res, next) => {
    Country.insert(req.body)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

router.get("/country/:id", (req, res, next) => {
    Country.findOne(req.params.id)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

router.post("/country/:id", (req, res, next) => {
    Country.update(req.params.id, req.body)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

router.delete("/country/:id", (req, res, next) => {
    Country.delete(req.params.id)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

export = router;
