import { gql } from "apollo-server";

const typeDefs = gql`
  """
  Usuário autenticado
  """
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Collaborator {
    id: ID! # mapeia _key
    name: String!
    email: String!
    role: CollaboratorRole!
    squadId: ID
    createdAt: String!
    ownerId: ID!
  }

  enum CollaboratorRole {
    DEV
    DESIGN
    PM
  }

  type Squad {
    id: ID!
    name: String!
    description: String
    memberIds: [ID!]
    goal: String
    archived: Boolean!
    createdAt: String!
    ownerId: ID!
  }

  type Task {
    id: ID! # mapeia _key
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    difficulty: Int
    impact: Int
    squadId: ID!
    assigneeId: ID
    assignee: Collaborator
    createdAt: String!
    updatedAt: String!
    ownerId: ID!
  }

  type Query {
    _empty: Boolean
    # Helpers (mantidos para seu playground)
    getAllCollaborators: [Collaborator!]!
    getAllSquads: [Squad!]!
    getAllTasks: [Task!]!
    squads: [Squad!]!
    collaborators(filter: CollaboratorFilter): [Collaborator!]!
    tasks(squadId: ID, assigneeId: ID): [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    createCollaborator(input: CreateCollaboratorInput!): Collaborator!
    createSquad(input: CreateSquadInput!): Squad!
    addMemberToSquad(squadId: ID!, memberId: ID!): Squad!
    removeMemberFromSquad(squadId: ID!, memberId: ID!): Squad!
    updateSquad(input: UpdateSquadInput!): Squad!
    deleteSquad(id: ID!): Boolean!

    createTask(input: CreateTaskInput!): Task!
    updateTask(input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }

  # ---------- INPUTS ----------
  input CollaboratorFilter {
    squadId: ID
  }

  input CreateCollaboratorInput {
    name: String!
    email: String!
    role: CollaboratorRole
    squadId: ID
  }

  input CreateSquadInput {
    name: String!
    description: String
    memberIds: [ID!]
  }

  input UpdateSquadInput {
    id: ID!
    name: String
    description: String
    archived: Boolean
  }

  enum TaskStatus {
    TODO
    DOING
    BLOCKED
    CANCELED
    DONE
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  input CreateTaskInput {
    title: String!
    description: String
    priority: TaskPriority
    squadId: ID!
    assigneeId: ID
  }

  input UpdateTaskInput {
    id: ID!
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    difficulty: Int
    impact: Int
    assigneeId: ID
  }
`;

export default typeDefs;
