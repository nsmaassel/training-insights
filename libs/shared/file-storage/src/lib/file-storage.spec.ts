import { fileStorage } from './file-storage';

describe('fileStorage', () => {
  it('should work', () => {
    expect(fileStorage()).toEqual('file-storage');
  });
});
