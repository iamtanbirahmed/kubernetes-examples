import axios from 'axios';

describe('GET /command', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/command`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello Command API' });
  });
});
