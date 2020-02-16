import app from '../../src/app';

describe('\'roomKV\' service', () => {
    it('registered the service', () => {
        const service = app.service('room-kv');
        expect(service).toBeTruthy();
    });

    describe('create a new roomKV', () => {
        const roomName = 'test room';

        beforeEach(async () => {
            // Make sure the record for the roomName doesn't exist
            try {
                await app.service('room-kv').remove(roomName);
            }
            catch (err) {
                // Do nothing, it just means the roomKV for the room doesn't exist, so creation can be tested
            }
        });

        it('creates a room with an empty keyValue map', async () => {
            const { _id, keyValues } = await app.service('room-kv').create({
                _id: roomName,
            }, {});

            expect(_id).toBe(roomName);
            expect(keyValues).toBeInstanceOf(Map);
            expect(keyValues.size).toBe(0);
        });

        it('creates a room with specified key values', async () => {
            const kvs = [
                ['foo', '12'],
                ['bar', 'snafu'],
            ];
            const { _id, keyValues } = await app.service('room-kv').create({
                _id: roomName,
                keyValues: new Map(kvs),
            }, {});

            expect(_id).toBe(roomName);
            expect(keyValues).toBeInstanceOf(Map);
            expect(keyValues.size).toBe(kvs.length);
            for (const [k, v] of kvs) {
                expect(keyValues.get(k)).toBe(v);
            }
        });
    });

    describe('patch a roomKV', () => {
        const roomName = 'test room';

        beforeEach(async () => {
            // Make sure the record for the roomName exists with no keyValues
            try {
                await app.service('room-kv').remove(roomName);
            }
            catch (err) {
                // Do nothing, it just means the roomKV for the room didn't exist
            }

            // if this throws an error, something went wrong, so let it go
            await app.service('room-kv').create({ _id: roomName });
        });

        it('can add a new key/value pair when there are no keyValues', async () => {
            const kvs = [
                ['new-value', '42'],
            ];
            const { _id, keyValues } = await app.service('room-kv').patch(roomName, {
                keyValues: new Map(kvs),
            }, {});

            expect(_id).toBe(roomName);
            // I'd expect keyValues to be a Map but it seems it's an Object
            expect(keyValues).toBeInstanceOf(Object);
            const patchedKeyValues = Object.entries(keyValues);
            expect(patchedKeyValues.length).toBe(kvs.length);
            for (const [k, v] of kvs) {
                expect(keyValues[k]).toBe(v);
            }
        });

        it('can add a new key/value pair when there are existing keyValues', async () => {
            const kvs = [
                ['old-value1', '42'],
                ['old-value2', 'yada yada'],
            ];
            await app.service('room-kv').patch(roomName, {
                keyValues: new Map(kvs),
            }, {});

            const newKvs = [
                ['new-value1', 'quick brown fox'],
            ];
            const { _id, keyValues } = await app.service('room-kv').patch(roomName, {
                keyValues: new Map(newKvs),
            }, {});

            // TODO: This fails, the patch is replacing the keyValues, not merging it
            // so there is work to be done to make patch be able to merge keyValues - mjl 2020-01-25
            console.log('patch to existing kvs', keyValues);
            expect(_id).toBe(roomName);
            const patchedKeyValues = Object.entries(keyValues);
            expect(patchedKeyValues.length).toBe(kvs.length + newKvs.length);
            for (const [k, v] of [...kvs, ...newKvs]) {
                expect(keyValues[k]).toBe(v);
            }
        });

        it('will coerce a numeric value to a string', async () => {
            const kvs = [
                [ 'new-value', 42 ],
                [ '2nd-new-value', 100.22 ],
            ]
            const { _id, keyValues } = await app.service('room-kv').patch(roomName, {
                keyValues: new Map(kvs),
            }, {})

            expect(_id).toBe(roomName)
            // I'd expect keyValues to be a Map but it seems it's an Object
            expect(keyValues).toBeInstanceOf(Object)
            const patchedKeyValues = Object.entries(keyValues)
            expect(patchedKeyValues.length).toBe(kvs.length)
            for (const [ k, v ] of kvs) {
                expect(keyValues[k]).toBe(v.toString())
            }
        });

        it('can modify the value of an existing key', async () => {
            const kvs = [
                [ 'value1', '42' ],
                [ 'value2', 'yada yada' ],
            ]
            await app.service('room-kv').patch(roomName, {
                keyValues: new Map(kvs),
            }, {})

            const modifiedKvs = [
                [ 'value2', 'quick brown fox' ],
            ]
            const { _id, keyValues } = await app.service('room-kv').patch(roomName, {
                keyValues: new Map(modifiedKvs),
            }, {})

            expect(_id).toBe(roomName)
            const patchedKeyValues = Object.entries(keyValues)
            expect(patchedKeyValues.length).toBe(kvs.length) // number of keys is unchanged
            expect(keyValues['value2']).not.toBe(kvs[1][1]) // modified key does not equal original value
            expect(keyValues['value2']).toBe(modifiedKvs[0][1]) // modified key equals new value
            expect(keyValues['value1']).toBe(kvs[0][1]) // unchanged key equals original value
        });
    });
});
