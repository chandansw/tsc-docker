import { Collection as MongoCollection, ObjectID } from "mongodb";
import { NotFound } from "http-errors";
import { DB } from "./db";

/**
 * Convert ID string to ObjectID for use in queries
 * @param id ID String
 */
export function _id(id: string): ObjectID {
    try {
        return new ObjectID(id);
    } catch (err) {
        throw new NotFound(`Not a valid resource id: '${id}'`);
    }
}

/**
 * Convert an Array of ID strings to ObjectIDs for use in queries
 * Malformed IDs are dropped from the array
 * @param ids Array of ID Strings
 */
function _ids(ids: Array<string>): Array<ObjectID> {
    return ids.map(id => {
        try {
            return new ObjectID(id);
        } catch (err) {
            /* Ignore bad ids in the array */
        }
    }).filter(id => id); // Filter out failed conversions
}

/**
 * Maps an object of data to a Class instance
 * Ensures only class properties are mapped
 * @param data Object of data
 */
function mapObject(obj: Object, cls) {
    let item = new cls();
    item._id = obj["_id"];
    item.type = item.constructor.name.toLowerCase();
    Object.keys(item).forEach(k => item[k] = (obj[k]) ? obj[k] : item[k]);
    return item;
}

/**
 * Mediator providing wrapper funcitons for Collection CRUD
 */
export class CollectionMediator {

    /**
     * Name of the collection in MongoDB
     */
    private _collectionName: string;

    /**
     * MongoDB Collection object
     */
    public _collection: MongoCollection;

    /**
     * Class to map response object onto
     */
    public _class: Object;

    /**
     * Creates a new Collection
     * @param collectionName Name of the collection
     * @param cls Object instance class
     */
    constructor(collectionName: string, cls: Object) {
        this._collectionName = collectionName;
        this._collection = DB.getInstance().collection(collectionName);
        this._class = cls;
    }

    /**
     * Find records by query
     * @param query
     */
    public find(query?: Object): Promise<Array<any>> {
        return this._collection.find(query).toArray()
            .then(arr => arr.map(obj => mapObject(obj, this._class)));
    }

    /**
     * Find one record by query
     * @param query
     */
    public findOne(query: Object): Promise<any> {
        return this._collection.findOne(query)
            .then(obj => {
                if (obj == null) throw new NotFound(`No record exists with that id`);
                return mapObject(obj, this._class)
            });
    }

    /**
     * Insert new record
     * @param data
     */
    public insert(data: Object): Promise<any> {
        return this._collection.insert(data)
            .then(res => res.ops[0])
            .then(obj => mapObject(obj, this._class));
    }

    /**
     * Update records by query
     * @param query
     * @param data
     */
    public update(query: Object, data: Object): Promise<Array<any>> {
        return this._collection
            .findOneAndReplace(query, data)
            .then(_ => this.find(query));
    }

    /**
     * Update one record by query
     * Throws Not Found if.. er.. not found
     * @param query
     * @param data
     */
    public updateOne(query: Object, data: any): Promise<any> {
        delete data._id;
        return this.update(query, data)
            .then(res => {
                if (res.length) return res[0];
                throw NotFound(`No record exists with that id`);
            });
    }

    /**
     * Delete records by query
     * @param query
     */
    public delete(query): Promise<any> {
        return this._collection.findOneAndDelete(query);
    }
}
