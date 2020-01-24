import app from '../../src/app';

describe('\'roomKV\' service', () => {
  it('registered the service', () => {
    const service = app.service('room-kv');
    expect(service).toBeTruthy();
  });
});
