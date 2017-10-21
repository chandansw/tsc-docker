import { CollectionMediator } from "../lib/collectionMediator";

export class Country {

    public _id: string;

    public type: string;

    public name: string = null;

    static _mediator = new CollectionMediator("countries", Country);

    static findAll(): Promise<Array<Country>> {
        return this._mediator.findAll();
    }

    static findOne(id): Promise<Country> {
        return this._mediator.findOne(id);
    }

    static findMany(ids: Array<string>): Promise<Array<Country>> {
        return this._mediator.findMany(ids);
    }

    static insert(data): Promise<Country> {
        return this._mediator.insert(data);
    }

    static update(id, data): Promise<Country> {
        return this._mediator.update(id, data);
    }

    static delete(id): Promise<string> {
        return this._mediator.delete(id);
    }
}
