import { AdminJwtGuard } from './admin-jwt.guard';

describe('AdminJwtGuard', () => {
  it('should be defined', () => {
    expect(new AdminJwtGuard()).toBeDefined();
  });
});
