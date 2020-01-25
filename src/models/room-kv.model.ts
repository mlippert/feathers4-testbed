// roomKV-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';

function createModel(app: Application) {
    const modelName = 'roomKv';
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const schema = new Schema({
        /** this is the room name */
        _id: { type: String, required: true },

        /** map of key value pairs for this room */
        keyValues: { type: Map, of: String, default: new Map() },
    }, {
        timestamps: true,
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);
}

export default createModel;
export {
    createModel,
};
