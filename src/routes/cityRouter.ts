import { Router } from "express";
import { _id } from "../lib/collectionMediator";
import { Country } from "../models/Country";
import { City } from "../models/City";

const router = Router();

router.get("/country/:countryId/city", (req, res, next) => {
    City.findAll(req.params.countryId)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

router.post("/country/:countryId/city", (req, res, next) => {
    City.insert(req.params.countryId, req.body)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

router.get("/country/:countryId/city/:id", (req, res, next) => {
    City.findOne(req.params.id, req.params.countryId)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

router.post("/country/:countryId/city/:id", (req, res, next) => {
    City.update(req.params.id, req.params.countryId, req.body)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

router.delete("/country/:countryId/city/:id", (req, res, next) => {
    City.delete(req.params.id, req.params.countryId)
        .then(data => res.jsonp({ data: data }))
        .catch(next);
});

export = router;
