// Path: src/stakeholders/user/factory/graphql/user.resolver.ts
// DESC: This is the main entry point for the graphql application.
// URL: https://docs.nestjs.com/graphql/resolvers
'use strict';
import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  IMutation,
  IQuery,
  User,
  UserInput,
} from '../../../../../generated/graphql/user/user.graphql';
import { CreateUserRequestDTO, UpdateUserRequestDTO, UserResponseDTO } from '../../dto';
import { UserService } from '../../user.service';

// curl -X POST -H "Content-Type: application/json" -d '{
//   "query": "query IntrospectionQuery { __schema { types { name kind description } queryType { name } mutationType { name } } }"
// }' http://0.0.0.0:3001/graphql | jq

@Resolver(User)
export class UserResolver implements IQuery, IMutation {
  private readonly logger = new Logger(UserResolver.name);
  constructor(private readonly userService: UserService) {}

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{ "query": "mutation { createUser( userDTO: { UUID: \"00000000-0000-0000-0000-000000000000\", ID: \"john.doe\", metadata: { name: \"John Doe\", dates: { createdAt: \"2021-01-01T00:00:00.000Z\", createdBy: \"john.doe\", updatedAt: \"2021-01-01T00:00:00.000Z\", updatedBy: \"john.doe\" } }, content: { email: \"john.doe@mail.com\", phone: \"0912-345-678\", firstName: \"John\", lastName: \"Doe\", projectRoles: [I], scrumRoles: [I], password: \"P@ssw0rd!234\" } } token: \"\" ) { UUID ID metadata { name dates { createdAt createdBy updatedAt updatedBy } } content { email phone firstName lastName projectRoles scrumRoles } } }" }' | jq
  @Mutation(() => User, { name: 'createUser' })
  // @UseGuards(GraphQLAuthGuard)
  async createUser(
    @Args('userDTO') userDTO: UserInput,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User | null> {
    // throw a Error('Method not implemented.');
    const createUserRequestDTO = plainToInstance(CreateUserRequestDTO, userDTO);
    const errors = await validate(createUserRequestDTO);
    if (errors.length > 0) {
      // Handle validation errors
      throw new Error(`Validation failed: ${JSON.stringify(errors, null, 2)}`);
    }
    const userResponseDTO: UserResponseDTO =
      await this.userService.createUser(createUserRequestDTO);
    const user: Record<string, any> = instanceToPlain(userResponseDTO);
    const userResponse: User = plainToInstance(User, user);
    return userResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{ "query": "mutation { updateUser( UUID: \"520DE39D-C11A-484A-A88B-DE9AEAC88768\", userDTO: { UUID: \"520DE39D-C11A-484A-A88B-DE9AEAC88768\", ID: \"john.doe\", metadata: { name: \"John Doe\", dates: { createdAt: \"2021-01-01T00:00:00.000Z\", createdBy: \"john.doe\", updatedAt: \"2021-01-01T00:00:00.000Z\", updatedBy: \"john.doe\", startDate: \"2023-09-27T00:00:00.000Z\", endDate: \"2023-09-28T00:00:00.000Z\", startedAt: \"2023-09-27T00:00:00.000Z\", startedBy: \"john.doe\", completedAt: \"2023-09-29T00:00:00.000Z\", completedBy: \"john.doe\" } }, content: { email: \"john.doe@mail.com\", phone: \"0912-345-678\", firstName: \"Jane\", lastName: \"Doe\", projectRoles: [ I ], scrumRoles: [ I ], password: \"P@ssw0rd!234\" } } token: \"your_valid_token_here\" ) { UUID ID metadata { name dates { createdAt createdBy updatedAt updatedBy } } content { email phone firstName lastName projectRoles scrumRoles } } } "}' | jq
  @Mutation(() => User, { name: 'updateUser' })
  // @UseGuards(GraphQLAuthGuard)
  async updateUser(
    @Args('UUID', { type: () => String }) UUID: string,
    @Args('userDTO') userDTO: UserInput,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User | null> {
    // throw new Error('Method not implemented.');
    const updateUserRequestDTO = plainToInstance(UpdateUserRequestDTO, userDTO);
    const errors = await validate(updateUserRequestDTO);
    if (errors.length > 0) {
      // Handle validation errors
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }
    const userResponseDTO: UserResponseDTO = await this.userService.updateUser(
      UUID,
      updateUserRequestDTO,
    );
    const user: Record<string, any> = instanceToPlain(userResponseDTO);
    const userResponse: User = plainToInstance(User, user);
    return userResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "mutation { deleteUser(UUID: \"00000000-0000-0000-0000-000000000000\" token: \"\") { UUID ID metadata { name dates { createdAt createdBy updatedAt updatedBy } } content { email phone firstName lastName projectRoles scrumRoles } } }"}' | jq
  @Mutation(() => User, { name: 'deleteUser' })
  // @UseGuards(GraphQLAuthGuard)
  async deleteUser(
    @Args('UUID', { type: () => String }) UUID: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User | null> {
    // throw new Error('Method not implemented.');
    const userResponseDTO: UserResponseDTO = await this.userService.deleteUser(UUID);
    const user: Record<string, any> = instanceToPlain(userResponseDTO);
    const userResponse: User = plainToInstance(User, user);
    return userResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ listUsers(token: \"\") { UUID ID metadata { name dates { createdAt createdBy updatedAt updatedBy } } content { email phone firstName lastName projectRoles scrumRoles } } }"}' | jq
  @Query(() => [User], { name: 'listUsers' })
  // @UseGuards(GraphQLAuthGuard)
  async listUsers(@Args('token') token: string): Promise<(User | null)[]> {
    // throw new Error('Method not implemented.');
    const listUserResponseDTO: UserResponseDTO[] = await this.userService.listUsers();
    const listUsersResponse: (User | null)[] = [];
    for (const userResponseDTO of listUserResponseDTO) {
      const user: Record<string, any> = instanceToPlain(userResponseDTO);
      const userResponse: User = plainToInstance(User, user);
      listUsersResponse.push(userResponse);
    }

    return listUsersResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ getUser(UUID: \"00000000-0000-0000-0000-000000000000\" token: \"\") { UUID ID metadata { name dates { createdAt createdBy updatedAt updatedBy } } content { email phone firstName lastName projectRoles scrumRoles } } }"}' | jq
  @Query(() => User, { name: 'getUser' })
  // @UseGuards(GraphQLAuthGuard)
  async getUser(
    @Args('UUID', { type: () => String }) UUID: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User | null> {
    // throw new Error('Method not implemented.');
    const userResponseDTO: UserResponseDTO = await this.userService.getUser(UUID);
    const user: Record<string, any> = instanceToPlain(userResponseDTO);
    const userResponse: User = plainToInstance(User, user);
    return userResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ getUserByID(ID: \"john.doe\" token: \"\") { UUID ID metadata { name dates { createdAt createdBy updatedAt updatedBy } } content { email phone firstName lastName projectRoles scrumRoles } } }"}' | jq
  @Query(() => User, { name: 'getUserByID' })
  // @UseGuards(GraphQLAuthGuard)
  async getUserByID(
    @Args('ID', { type: () => String }) ID: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User | null> {
    // throw new Error('Method not implemented.');
    const userResponseDTO: UserResponseDTO = await this.userService.getUserByID(ID);
    const user: Record<string, any> = instanceToPlain(userResponseDTO);
    const userResponse: User = plainToInstance(User, user);
    return userResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ getUserByName(name: \"John Doe\" token: \"\") { UUID ID metadata { name dates { createdAt createdBy updatedAt updatedBy } } content { email phone firstName lastName projectRoles scrumRoles } } }"}' | jq
  @Query(() => User, { name: 'getUserByName' })
  // @UseGuards(GraphQLAuthGuard)
  async getUserByName(
    @Args('name', { type: () => String }) name: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User | null> {
    // throw new Error('Method not implemented.');
    const userResponseDTO: UserResponseDTO = await this.userService.getUserByName(name);
    const user: Record<string, any> = instanceToPlain(userResponseDTO);
    const userResponse: User = plainToInstance(User, user);
    return userResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ getUserByEmail(email: \"john.doe@mail.com\" token: \"\") { UUID ID metadata { name dates { createdAt createdBy updatedAt updatedBy } } content { email phone firstName lastName projectRoles scrumRoles } } }"}' | jq
  @Query(() => User, { name: 'getUserByEmail' })
  // @UseGuards(GraphQLAuthGuard)
  async getUserByEmail(
    @Args('email', { type: () => String }) email: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User | null> {
    // throw new Error('Method not implemented.');
    const userResponseDTO: UserResponseDTO = await this.userService.getUserByEmail(email);
    const user: Record<string, any> = instanceToPlain(userResponseDTO);
    const userResponse: User = plainToInstance(User, user);
    return userResponse;
  }
}
