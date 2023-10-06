// Path: src/stakeholders/team/factory/graphql/team.resolver.ts
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
  Team,
  TeamInput,
} from '../../../../../generated/graphql/team/team.graphql';
import { CreateTeamRequestDTO, UpdateTeamRequestDTO, TeamResponseDTO } from '../../dto';
import { TeamService } from '../../team.service';

// curl -X POST -H "Content-Type: application/json" -d '{
//   "query": "query IntrospectionQuery { __schema { types { name kind description } queryType { name } mutationType { name } } }"
// }' http://0.0.0.0:3001/graphql | jq

@Resolver(Team)
export class TeamResolver implements IQuery, IMutation {
  private readonly logger = new Logger(TeamResolver.name);
  constructor(private readonly teamService: TeamService) {}

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{ "query": "mutation { createTeam( teamDTO: { UUID: \"00000000-0000-0000-0000-000000000000\", ID: \"john.doe\", metadata: { name: \"abc.team\", dates: { createdAt: \"2021-01-01T00:00:00.000Z\", createdBy: \"john.doe\", updatedAt: \"2021-01-01T00:00:00.000Z\", updatedBy: \"john.doe\" } }, content: { email: \"abc.team@mail.com\", members: [ { ID: \"john.doe\", UUID: \"00000000-0000-0000-0000-000000000000\" }, ], productOwner: { ID: \"john.doe\", UUID: \"00000000-0000-0000-0000-000000000000\" }, scrumMaster: { ID: \"john.doe\", UUID: \"00000000-0000-0000-0000-000000000000\" } } } token: \"\" ) { UUID, ID, metadata { name, dates { createdAt, createdBy, updatedAt, updatedBy } }, content { email, members { ID, UUID }, productOwner { ID, UUID } ,scrumMaster { ID, UUID } }} }" }' | jq
  @Mutation(() => Team, { name: 'createTeam' })
  // @UseGuards(GraphQLAuthGuard)
  async createTeam(
    @Args('teamDTO') teamDTO: TeamInput,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Team | null> {
    // throw a Error('Method not implemented.');
    const createTeamRequestDTO = plainToInstance(CreateTeamRequestDTO, teamDTO);
    const errors = await validate(createTeamRequestDTO);
    if (errors.length > 0) {
      // Handle validation errors
      throw new Error(`Validation failed: ${JSON.stringify(errors, null, 2)}`);
    }
    const teamResponseDTO: TeamResponseDTO =
      await this.teamService.createTeam(createTeamRequestDTO);
    const team: Record<string, any> = instanceToPlain(teamResponseDTO);
    const teamResponse: Team = plainToInstance(Team, team);
    return teamResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{ "query": "mutation { updateTeam( UUID: \"00000000-0000-0000-0000-000000000000\", teamDTO: { UUID: \"00000000-0000-0000-0000-000000000000\", ID: \"john.doe\", metadata: { name: \"John Doe\", dates: { createdAt: \"2021-01-01T00:00:00.000Z\", createdBy: \"john.doe\", updatedAt: \"2021-01-01T00:00:00.000Z\", updatedBy: \"john.doe\", startDate: \"2023-09-27T00:00:00.000Z\", endDate: \"2023-09-28T00:00:00.000Z\", startedAt: \"2023-09-27T00:00:00.000Z\", startedBy: \"john.doe\", completedAt: \"2023-09-29T00:00:00.000Z\", completedBy: \"john.doe\" } }, content: { email: \"john.doe@mail.com\", phone: \"0912-345-678\", firstName: \"Jane\", lastName: \"Doe\", projectRoles: [ I ], scrumRoles: [ I ], password: \"P@ssw0rd!234\" } } token: \"your_valid_token_here\" ) { UUID, ID, metadata { name, dates { createdAt, createdBy, updatedAt, updatedBy } }, content { email, members { ID, UUID }, productOwner { ID, UUID } ,scrumMaster { ID, UUID } }} } "}' | jq
  @Mutation(() => Team, { name: 'updateTeam' })
  // @UseGuards(GraphQLAuthGuard)
  async updateTeam(
    @Args('UUID', { type: () => String }) UUID: string,
    @Args('teamDTO') teamDTO: TeamInput,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Team | null> {
    // throw new Error('Method not implemented.');
    const updateTeamRequestDTO = plainToInstance(UpdateTeamRequestDTO, teamDTO);
    const errors = await validate(updateTeamRequestDTO);
    if (errors.length > 0) {
      // Handle validation errors
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }
    const teamResponseDTO: TeamResponseDTO = await this.teamService.updateTeam(
      UUID,
      updateTeamRequestDTO,
    );
    const team: Record<string, any> = instanceToPlain(teamResponseDTO);
    const teamResponse: Team = plainToInstance(Team, team);
    return teamResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "mutation { deleteTeam(UUID: \"00000000-0000-0000-0000-000000000000\" token: \"\") { UUID, ID, metadata { name, dates { createdAt, createdBy, updatedAt, updatedBy } }, content { email, members { ID, UUID }, productOwner { ID, UUID } ,scrumMaster { ID, UUID } }} }"}' | jq
  @Mutation(() => Team, { name: 'deleteTeam' })
  // @UseGuards(GraphQLAuthGuard)
  async deleteTeam(
    @Args('UUID', { type: () => String }) UUID: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Team | null> {
    // throw new Error('Method not implemented.');
    const teamResponseDTO: TeamResponseDTO = await this.teamService.deleteTeam(UUID);
    const team: Record<string, any> = instanceToPlain(teamResponseDTO);
    const teamResponse: Team = plainToInstance(Team, team);
    return teamResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ listTeams(token: \"\") { UUID, ID, metadata { name, dates { createdAt, createdBy, updatedAt, updatedBy } }, content { email, members { ID, UUID }, productOwner { ID, UUID } ,scrumMaster { ID, UUID } }} }"}' | jq
  @Query(() => [Team], { name: 'listTeams' })
  // @UseGuards(GraphQLAuthGuard)
  async listTeams(@Args('token') token: string): Promise<(Team | null)[]> {
    // throw new Error('Method not implemented.');
    const listTeamResponseDTO: TeamResponseDTO[] = await this.teamService.listTeams();
    const listTeamsResponse: (Team | null)[] = [];
    for (const teamResponseDTO of listTeamResponseDTO) {
      const team: Record<string, any> = instanceToPlain(teamResponseDTO);
      const teamResponse: Team = plainToInstance(Team, team);
      listTeamsResponse.push(teamResponse);
    }

    return listTeamsResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ getTeam(UUID: \"00000000-0000-0000-0000-000000000000\" token: \"\") { UUID, ID, metadata { name, dates { createdAt, createdBy, updatedAt, updatedBy } }, content { email, members { ID, UUID }, productOwner { ID, UUID } ,scrumMaster { ID, UUID } }} }"}' | jq
  @Query(() => Team, { name: 'getTeam' })
  // @UseGuards(GraphQLAuthGuard)
  async getTeam(
    @Args('UUID', { type: () => String }) UUID: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Team | null> {
    // throw new Error('Method not implemented.');
    const teamResponseDTO: TeamResponseDTO = await this.teamService.getTeam(UUID);
    const team: Record<string, any> = instanceToPlain(teamResponseDTO);
    const teamResponse: Team = plainToInstance(Team, team);
    return teamResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ getTeamByID(ID: \"john.doe\" token: \"\") { UUID, ID, metadata { name, dates { createdAt, createdBy, updatedAt, updatedBy } }, content { email, members { ID, UUID }, productOwner { ID, UUID } ,scrumMaster { ID, UUID } }} }"}' | jq
  @Query(() => Team, { name: 'getTeamByID' })
  // @UseGuards(GraphQLAuthGuard)
  async getTeamByID(
    @Args('ID', { type: () => String }) ID: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Team | null> {
    // throw new Error('Method not implemented.');
    const teamResponseDTO: TeamResponseDTO = await this.teamService.getTeamByID(ID);
    const team: Record<string, any> = instanceToPlain(teamResponseDTO);
    const teamResponse: Team = plainToInstance(Team, team);
    return teamResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ getTeamByName(name: \"John Doe\" token: \"\") { UUID, ID, metadata { name, dates { createdAt, createdBy, updatedAt, updatedBy } }, content { email, members { ID, UUID }, productOwner { ID, UUID } ,scrumMaster { ID, UUID } }} }"}' | jq
  @Query(() => Team, { name: 'getTeamByName' })
  // @UseGuards(GraphQLAuthGuard)
  async getTeamByName(
    @Args('name', { type: () => String }) name: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Team | null> {
    // throw new Error('Method not implemented.');
    const teamResponseDTO: TeamResponseDTO = await this.teamService.getTeamByName(name);
    const team: Record<string, any> = instanceToPlain(teamResponseDTO);
    const teamResponse: Team = plainToInstance(Team, team);
    return teamResponse;
  }

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ getTeamByEmail(email: \"abc.team@mail.com\" token: \"\") { UUID, ID, metadata { name, dates { createdAt, createdBy, updatedAt, updatedBy } }, content { email, members { ID, UUID }, productOwner { ID, UUID } ,scrumMaster { ID, UUID } }} }"}' | jq
  @Query(() => Team, { name: 'getTeamByEmail' })
  // @UseGuards(GraphQLAuthGuard)
  async getTeamByEmail(
    @Args('email', { type: () => String }) email: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Team | null> {
    // throw new Error('Method not implemented.');
    const teamResponseDTO: TeamResponseDTO = await this.teamService.getTeamByEmail(email);
    const team: Record<string, any> = instanceToPlain(teamResponseDTO);
    const teamResponse: Team = plainToInstance(Team, team);
    return teamResponse;
  }
}
