import { Collection as MongoCollection, ObjectID } from "mongodb";
import { NotFound } from "http-errors";
import { DB } from "./db";

/**
 * Convert ID string to ObjectID for use in queries
 * @param id ID String
 */
function _id(id: string): ObjectID {
    try {
        return new ObjectID(id);
    } catch (err) {
        throw new NotFound(`No record exists with id: '${id}'`);
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
    item.type = item.constructor.name;
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
     * Find all records in this Collections
     */
    public findAll(): Promise<Array<any>> {
        return this._collection.find({}).toArray()
            .then(arr => arr.map(obj => mapObject(obj, this._class)));
    }

    /**
     * Find one record in this Collection by ID
     * @param id ID String
     */
    public findOne(id: string): Promise<any> {
        return this._collection.findOne({ _id: _id(id) })
            .then(obj => mapObject(obj, this._class));
    }

    /**
     * Find all records in the set of IDs
     * @param ids Array of ids
     */
    public findMany(ids: Array<string>): Promise<Array<any>> {
        return this._collection.find({ _id: { $in: _ids(ids) } }).toArray()
            .then(arr => arr.map(obj => mapObject(obj, this._class)));
    }

    /**
     * Insert a new record into this Collection
     * @param data Data Object
     */
    public insert(data: Object): Promise<any> {
        return this._collection.insert(data)
            .then(res => res.ops[0])
            .then(obj => mapObject(obj, this._class));
    }

    /**
     * Update (replace) a record in this Collection
     * @param id ID String
     * @param data Data Object
     */
    public update(id: string, data: Object): Promise<any> {
        return this._collection
            .findOneAndReplace({ _id: _id(id) }, data)
            .then(_ => this.findOne(id));
    }

    /**
     * Delete a record from this Collection
     * @param id ID String
     */
    public delete(id: string): Promise<string> {
        return this._collection.findOneAndDelete({ _id: _id(id) })
            .then(_ => id);
    }
}
