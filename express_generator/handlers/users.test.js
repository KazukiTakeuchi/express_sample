const mockRedisGet = jest.fn();
const mockRedisScanStream = jest.fn();
jest.mock('../lib/redis', () => {
  return {
    getClient: jest.fn().mockImplementation(() => {
      return {
        get: mockRedisGet,
        scanStream: mockRedisScanStream
      };
    })
  };
});

const { getUser, getUsers } = require('./users');

test('getUser', async () => {
  mockRedisGet.mockResolvedValue(JSON.stringify({ id: 1, name: 'kazu' }));

  const reqMock = { params: { id: 1 } };
  const res = await getUser(reqMock);

  // 返却値のテスト
  expect(res.id).toStrictEqual(1);
  expect(res.name).toStrictEqual('kazu');

  // Redisの呼び出す回数のテスト
  expect(mockRedisGet).toHaveBeenCalledTimes(1);
  expect(mockRedisGet.mock.calls.length).toStrictEqual(1);

  // mockの引数のテスト
  const [arg1] = mockRedisGet.mock.calls[0];
  expect(arg1).toStrictEqual('users:1');
});

test('getUsers', async () => {
  const streamMock = {
    async*[Symbol.asyncIterator]() {
      yield ['users:1', 'users:2'];
      yield ['users:3', 'users:4'];
    }
  };
  mockRedisScanStream.mockReturnValueOnce(streamMock);
  mockRedisGet.mockImplementation((key) => {
    switch (key) {
      case 'users:1':
        return Promise.resolve(JSON.stringify({ id: 1, name: 'a' }));
      case 'users:2':
        return Promise.resolve(JSON.stringify({ id: 2, name: 'b' }));
      case 'users:3':
        return Promise.resolve(JSON.stringify({ id: 3, name: 'c' }));
      case 'users:4':
        return Promise.resolve(JSON.stringify({ id: 4, name: 'd' }));
    }
    return Promise.resolve(null);
  });

  const reqMock = {};

  const res = await getUsers(reqMock);

  expect(mockRedisScanStream).toHaveBeenCalledTimes(1);
  expect(mockRedisGet).toHaveBeenCalledTimes(4);
  expect(mockRedisGet.mock.calls.length).toStrictEqual(4);
  expect(res.users.length).toStrictEqual(4);
  expect(res.users).toStrictEqual([
    { id: 1, name: 'a' },
    { id: 2, name: 'b' },
    { id: 3, name: 'c' },
    { id: 4, name: 'd' }
  ]);
});
