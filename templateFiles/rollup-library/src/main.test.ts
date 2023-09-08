import HelloWorld from './main';

describe('HelloWorld', () => {
  it('should say hey!', () => {
    const hello = new HelloWorld();
    expect(hello.hi()).toBe('hey!');
  });
});