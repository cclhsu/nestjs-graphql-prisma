import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from 'generated/graphql/user/user.graphql';
import { UserDTO } from 'src/stakeholders/user/dto';
import {
  AuthResponse,
  IMutation,
  IQuery,
  LoginInput,
  LogoutResponse,
  RegisterInput,
  UserProfileResponse,
} from '../../../../generated/graphql/auth/auth.graphql';
import { AuthService } from '../../auth.service';
import { LoginRequestDTO, LoginResponseDTO, RegistrationResponseDTO } from '../../dto';

@Resolver()
export class AuthResolver implements IMutation, IQuery {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'register' })
  // @UseGuards(GraphQLAuthGuard)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    throw new Error('Method not implemented.');

    // const registrationRequestDTO: RegistrationRequestDTO = plainToInstance(
    //   RegistrationRequestDTO,
    //   input,
    // );
    // const errors = await validate(registrationRequestDTO);
    // if (errors.length > 0) {
    //   // Handle validation errors
    //   throw new Error(`Validation failed: ${JSON.stringify(errors, null, 2)}`);
    // }

    // const registrationResponseDTO: RegistrationResponseDTO =
    //   await this.authService.register(registrationRequestDTO);

    // const authResponse: AuthResponse = {
    //   token: registrationResponseDTO.token,
    // };
    // return authResponse;
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  // @UseGuards(GraphQLAuthGuard)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    // throw new Error('Method not implemented.');
    const loginRequestDTO: LoginRequestDTO = plainToInstance(LoginRequestDTO, input);
    const errors = await validate(loginRequestDTO);
    if (errors.length > 0) {
      // Handle validation errors
      throw new Error(`Validation failed: ${JSON.stringify(errors, null, 2)}`);
    }
    const loginResponseDTO: LoginResponseDTO = await await this.authService.login(loginRequestDTO);
    const authResponse: AuthResponse = {
      token: loginResponseDTO.token,
    };
    return authResponse;
  }

  @Mutation(() => LogoutResponse, { name: 'logout' })
  // @UseGuards(GraphQLAuthGuard)
  async logout(@Args('token') token: string): Promise<LogoutResponse> {
    // throw new Error('Method not implemented.');
    await this.authService.logout(token);
    const logoutResponse: LogoutResponse = {
      success: true,
    };
    return logoutResponse;
  }

  @Query(() => UserProfileResponse, { name: 'userProfile' })
  // @UseGuards(GraphQLAuthGuard)
  async userProfile(@Args('token') token: string): Promise<UserProfileResponse> {
    // throw new Error('Method not implemented.');
    const userDTO: UserDTO = await this.authService.getProfile(token);
    const user: Record<string, any> = instanceToPlain(userDTO);
    const userResponse: User = plainToInstance(User, user);
    const userProfileResponse: UserProfileResponse = {
      user: userResponse,
    };
    return userProfileResponse;
  }

  //   const userDTO: UserDTO = await this.authService.getProfile(token);
  //   const userProfileResponse: UserProfileResponse = {
  //     user: {
  //       ID: userDTO.ID,
  //       UUID: userDTO.UUID,
  //       metadata: {
  //         name: userDTO.metadata.name,
  //         dates: {
  //           createdAt: userDTO.metadata.dates.createdAt,
  //           createdBy: userDTO.metadata.dates.createdBy,
  //           updatedAt: userDTO.metadata.dates.updatedAt,
  //           updatedBy: userDTO.metadata.dates.updatedBy,
  //         },
  //       },
  //       content: {
  //         email: userDTO.content.email,
  //         phone: userDTO.content.phone,
  //         lastName: userDTO.content.lastName,
  //         firstName: userDTO.content.firstName,
  //         projectRoles: userDTO.content.projectRoles.map(
  //           (role: string) => role as PROJECT_ROLE_TYPES,
  //         ),
  //         scrumRoles: userDTO.content.scrumRoles.map((role: string) => role as SCRUM_ROLE_TYPES),
  //         password: userDTO.content.password,
  //       },
  //     },
  //   };
  //   return userProfileResponse;

  // // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/query -d '{"query": "mutation { register: Register(input: { ID: \"00000000-0000-0000-0000-000000000001\", metadata: { name: \"John Doe\", dates: { createdAt: \"2021-01-01T00:00:00.000Z\", createdBy: \"JOHN.DOE\", updatedAt: \"2021-01-01T00:00:00.000Z\", updatedBy: \"JOHN.DOE\" } }, content: { email: \"john.doe@mail.com\", phone: \"\", lastName: \"\", firstName: \"\", projectRoles: [], scrumRoles: [], password: \"\" } }) { user { ID } } }"}' | jq
  // @Query(() => AuthResponse)
  // async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
  //   const registrationResponseDTO: RegistrationResponseDTO = await this.authService.register(
  //     new CreateUserRequestDTO(
  //       input.ID,
  //       '00000000-0000-0000-0000-000000000000',
  //       new UserMetadataDTO(
  //         input.metadata.name,
  //         new CommonDateDTO(
  //           input.metadata.dates.createdAt,
  //           input.metadata.dates.createdBy,
  //           input.metadata.dates.updatedAt,
  //           input.metadata.dates.updatedBy,
  //         ),
  //       ),
  //       new UserContentDTO(
  //         input.content.email,
  //         input.content.phone,
  //         input.content.lastName,
  //         input.content.firstName,
  //         input.content.projectRoles.map((role) => role as PROJECT_ROLE_TYPES),
  //         input.content.scrumRoles.map((role) => role as SCRUM_ROLE_TYPES),
  //         input.content.password,
  //       ),
  //     ),
  //   );
  //   if (!registrationResponseDTO) {
  //     throw new Error('Registration failed');
  //   }

  //   const authResponse: AuthResponse = {
  //     token: '',
  //   };
  //   return authResponse;
  // }

  // // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/query -d '{"query": "mutation { login: Login(input: { ID: \"00000000-0000-0000-0000-000000000001\", email: \"john.doe@mail.com\", password: \"\" }) { token } }"}' | jq
  // @Query(() => AuthResponse)
  // async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
  //   const loginRequestDTO: LoginRequestDTO = new LoginRequestDTO(
  //     input.ID,
  //     input.email,
  //     input.password,
  //   );
  //   const loginResponseDTO: LoginResponseDTO = await await this.authService.login(loginRequestDTO);

  //   const authResponse: AuthResponse = {
  //     token: loginResponseDTO.token,
  //   };
  //   return authResponse;
  // }

  // @Query(() => LogoutResponse)
  // async logout(@Args('token') token: string): Promise<LogoutResponse> {
  //   await this.authService.logout(token);
  //   const logoutResponse: LogoutResponse = {
  //     success: true,
  //   };
  //   return logoutResponse;
  // }

  // @Query(() => UserProfileResponse)
  // async userProfile(@Args('token') token: string): Promise<UserProfileResponse> {
  //   const userDTO: UserDTO = await this.authService.getProfile(token);
  //   const userProfileResponse: UserProfileResponse = {
  //     user: {
  //       ID: userDTO.ID,
  //       UUID: userDTO.UUID,
  //       metadata: {
  //         name: userDTO.metadata.name,
  //         dates: {
  //           createdAt: userDTO.metadata.dates.createdAt,
  //           createdBy: userDTO.metadata.dates.createdBy,
  //           updatedAt: userDTO.metadata.dates.updatedAt,
  //           updatedBy: userDTO.metadata.dates.updatedBy,
  //         },
  //       },
  //       content: {
  //         email: userDTO.content.email,
  //         phone: userDTO.content.phone,
  //         lastName: userDTO.content.lastName,
  //         firstName: userDTO.content.firstName,
  //         projectRoles: userDTO.content.projectRoles.map(
  //           (role: string) => role as PROJECT_ROLE_TYPES,
  //         ),
  //         scrumRoles: userDTO.content.scrumRoles.map((role: string) => role as SCRUM_ROLE_TYPES),
  //         password: userDTO.content.password,
  //       },
  //     },
  //   };
  //   return userProfileResponse;
  // }

  // // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/query -d '{"query": "mutation { Login(input: { username: \"john.doe\", password: \"changeme\" }) { token } }"}' | jq
  // async Login(input: LoginInput): Promise<LoginResponse> {
  //   const tokenResponseDTO = await this.authService.login(input.username, input.password);
  //   const loginResponse: LoginResponse = {
  //     token: tokenResponseDTO.token,
  //   };
  //   return loginResponse;
  // }

  // //    curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/query -d '{
  // //        "query": "mutation Logout($input: SecuredInput!) { logout(input: $input) { message } }",
  // //        "variables": {
  // //            "input": {
  // //            "token": "YOUR_TOKEN_VALUE"
  // //            }
  // //        }
  // //        }' | jq
  // Logout(input: SecuredInput): LogoutResponse | Promise<LogoutResponse> {
  //   // this.authService.logout();
  //   const logoutResponse: LogoutResponse = {
  //     message: 'Successfully logged out',
  //     user: 'john.doe',
  //   };
  //   return logoutResponse;
  // }

  // //    curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/query -d '{
  // //        "query": "query GetProtectedData($input: SecuredInput!) { getProtectedData(input: $input) { success message } }",
  // //        "variables": {
  // //          "input": {
  // //            "token": "YOUR_TOKEN_VALUE"
  // //          }
  // //        }
  // //      }' | jq
  // //
  // GetProtectedData(input: SecuredInput): SecuredResponse | Promise<SecuredResponse> {
  //   const message = 'Protected data';
  //   const securedResponse: SecuredResponse = {
  //     success: true,
  //     message,
  //   };
  //   return securedResponse;
  // }

  // //    curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/query -d '{
  // //        "query": "query GetProfile($input: SecuredInput!) { getProfile(input: $input) { UUID lastName firstName role dateOfBirth email phoneNumber username } }",
  // //        "variables": {
  // //          "input": {
  // //            "token": "YOUR_TOKEN_VALUE"
  // //          }
  // //        }
  // //      }' | jq
  // //
  // async GetProfile(input: SecuredInput): Promise<GetUserProfileResponse> {
  //   // const uuid = input.token;
  //   const uuid = '00000000-0000-0000-0000-000000000001';
  //   const userProfileResponseDTO = await this.authService.getProfile(uuid);
  //   const getUserProfileResponse = plainToInstance(GetUserProfileResponse, userProfileResponseDTO);
  //   return getUserProfileResponse;
  // }
}
