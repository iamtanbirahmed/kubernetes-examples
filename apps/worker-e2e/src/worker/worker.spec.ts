import axios from 'axios';

describe('GET /worker', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/worker`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello Worker API' });
  });
});
