import { AdminTokenGuard } from './admin-token.guard';

describe('AdminTokenGuard', () => {
  it('should be defined', () => {
    expect(new AdminTokenGuard()).toBeDefined();
  });
});
