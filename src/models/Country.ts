import { ObjectID } from "mongodb";
import { BadRequest } from "http-errors";
import { CollectionMediator } from "../lib/collectionMediator";

export class Country {

    public _id?: ObjectID;

    public type?: string;

    public name: string = null;

    static _c = new CollectionMediator("countries", Country);

    static findAll(): Promise<Array<Country>> {
        return this._c.find();
    }

    static insert(data: Country): Promise<Country> {
        if (!data.name) throw new BadRequest("Required field 'name' missing");
        return this._c.insert(data);
    }

    static findOne(id: string): Promise<Country> {
        return this._c.findOneByID(id);
    }

    static update(id: string, data: Country): Promise<Country> {
        if (!data.name) throw new BadRequest("Required field 'name' missing");
        delete data._id;
        return this._c.updateByID(id, data);
    }

    static delete(id: string): Promise<string> {
        return this._c.deleteById(id);
    }
}
