import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

// TODO Move this to some utils file for import!
function isDefined<T>(value: T | undefined | null): value is T {
  return <T>value !== undefined && <T>value !== null;
}

const { authenticate } = authentication.hooks;

async function mergeKeyValues(context: HookContext): Promise<undefined> {
    if (!isDefined(context.id) || !isDefined(context.data.keyValues)) {
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
