import { Query, Resolver } from '@nestjs/graphql';
import { HelloJsonResponseDTO } from '../../dto/hello-json-response.dto';
import { HelloJsonResponse, IQuery } from '../../../../generated/graphql/hello/hello.graphql';
import { HelloService } from '../../hello.service';

@Resolver('hello')
export class HelloResolver implements IQuery {
  constructor(private readonly helloService: HelloService) {}

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ GetHelloString }"}' | jq
  // curl 'http://0.0.0.0:3001/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://0.0.0.0:3001' --data-binary '{"query":"# Write your query or mutation here\n{\n  GetHelloString\n}\n"}' --compressed
  @Query(() => String)
  GetHelloString(): string | Promise<string> {
    const helloString: string = this.helloService.getHelloString().toString();
    return helloString;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ GetHelloJson { data { message } } }"}' | jq
  // curl 'http://0.0.0.0:3001/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://0.0.0.0:3001' --data-binary '{"query":"# Write your query or mutation here\n{\n  GetHelloJson {\n    data {\n      message\n    }\n  }\n}\n"}' --compressed
  @Query(() => Object)
  async GetHelloJson(): Promise<HelloJsonResponse> {
    const responseDTO: HelloJsonResponseDTO = await this.helloService.getHelloJson();
    const helloJsonResponse: HelloJsonResponse = {
      data: {
        message: responseDTO.data.message,
      },
    };
    return helloJsonResponse;
  }
}
