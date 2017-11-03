import * as mongoose from "mongoose";

export const countrySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                ret.type = "Country";
                ret.url = `/country/${ret.id}`;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    });

export const Country = mongoose.model("Country", countrySchema);
