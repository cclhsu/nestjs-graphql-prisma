import { Test } from '@nestjs/testing';
import { HelloResolver } from './hello.resolver';
import { HelloService } from '../../hello.service';

describe('HelloResolver', () => {
  let resolver: HelloResolver;
  let service: HelloService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HelloResolver, HelloService],
    }).compile();

    resolver = moduleRef.get<HelloResolver>(HelloResolver);
    service = moduleRef.get<HelloService>(HelloService);
  });

  describe('getHelloString', () => {
    it('should return the hello string', async () => {
      const expectedResult = 'Hello World';

      jest.spyOn(service, 'getHelloString').mockResolvedValue(expectedResult);

      const result = await resolver.getHelloString();

      expect(result).toEqual(expectedResult);
      expect(service.getHelloString).toHaveBeenCalled();
    });
  });

  describe('getHelloJson', () => {
    it('should return the hello JSON', async () => {
      const expectedResult = { message: 'Hello World' };

      jest.spyOn(service, 'getHelloJson').mockResolvedValue(expectedResult);

      const result = await resolver.getHelloJson();

      expect(result).toEqual(expectedResult);
      expect(service.getHelloJson).toHaveBeenCalled();
    });
  });
});
