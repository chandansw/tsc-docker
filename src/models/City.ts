import { ObjectID } from "mongodb";
import { BadRequest } from "http-errors";
import { _id, CollectionMediator } from "../lib/collectionMediator";

export class City {

    public _id?: ObjectID;

    public type?: string;

    public name: string = null;

    public countryId?: ObjectID;

    static _c = new CollectionMediator("cities", City);

    static findAll(countryId: string): Promise<Array<City>> {
        return this._c.find({ countryId: _id(countryId) });
    }

    static insert(countryId: string, data: City): Promise<City> {
        if (!data.name) throw new BadRequest("Required field 'name' missing");
        data.countryId = _id(countryId);
        return this._c.insert(data);
    }

    static findOne(id: string, countryId: string): Promise<City> {
        return this._c.findOne({ _id: _id(id), countryId: _id(countryId) });
    }

    static update(id: string, countryId: string, data: City): Promise<City> {
        if (!data.name) throw new BadRequest("Required field 'name' missing");
        data.countryId = _id(countryId);
        return this._c.updateOne({ _id: _id(id), countryId: _id(countryId) }, data);
    }

    static delete(id: string, countryId: string): Promise<string> {
        return this._c.delete({ _id: _id(id), countryId: _id(countryId) })
            .then(_ => id);
    }
}
