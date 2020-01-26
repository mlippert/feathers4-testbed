import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

async function mergeKeyValues(context: HookContext): Promise<undefined> {
    if (context.id === null || context.id === undefined) {
        return;
    }

    const curRoomKV = await context.service.get(context.id);
    const mergedKeyValues = new Map([...Object.entries(curRoomKV.keyValues), ...context.data.keyValues.entries()]);
    context.data.keyValues = mergedKeyValues;
}

export default {
    before: {
        all: [ authenticate('jwt') ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [ mergeKeyValues ],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
