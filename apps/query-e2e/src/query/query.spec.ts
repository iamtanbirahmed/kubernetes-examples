import axios from 'axios';

describe('GET /query', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/query`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello Query API' });
  });
});
