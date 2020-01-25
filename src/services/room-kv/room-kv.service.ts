// Initializes the `roomKV` service on path `/room-kv`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { RoomKv } from './room-kv.class';
import createModel from '../../models/room-kv.model';
import hooks from './room-kv.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'room-kv': RoomKv & ServiceAddons<any>;
    }
}

export default function (app: Application) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/room-kv', new RoomKv(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('room-kv');

    service.hooks(hooks);
}
