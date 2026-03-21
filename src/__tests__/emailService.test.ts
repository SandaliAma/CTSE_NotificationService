import { sendEmail } from '../services/emailService';

describe('emailService', () => {
  it('should return true when sending email', async () => {
    const result = await sendEmail('test@test.com', 'Welcome', 'Hello');
    expect(result).toBe(true);
  });
});
