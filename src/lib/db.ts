import { exit } from "process";
import { MongoClient, Db } from "mongodb";
import { Logger } from "./logger";

const logger = Logger.getInstance();

export class DB {

    /**
     * Connect to MongoDB
     */
    public static connect(url: string): Promise<Db | void> {
        if (this._instance) return Promise.resolve(this._instance);

        return MongoClient.connect(url)
            .then(db => {
                logger.info(`Connected to MongoDB server at ${url}`);
                return (this._instance = db);
            })
            .catch(err => {
                logger.error(err);
                exit(1);
            });
    }

    /**
     * Disconnect from DB
     */
    public static disconnect(){
        this.getInstance().close();
    }

    /**
     * Get the current MongoDB Database Object or throw an error
     */
    public static getInstance(): Db {
        if (this._instance) return this._instance;
        throw Error("MongoDB connection not established");
    }

    private static _instance: Db;
}
