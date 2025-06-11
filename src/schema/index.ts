import { gql } from "apollo-server";

const typeDefs = gql`
  """Usuário autenticado"""
  type User {
    id: ID!          # mapeia _key do Arango
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  """Membro de um squad"""
  type Collaborator {
    id: ID!          # mapeia _key
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

  """Grupo de trabalho"""
  type Squad {
    id: ID!          # mapeia _key
    name: String!
    description: String
    memberIds: [String!]!
    archived: Boolean!
    createdAt: String!
    ownerId: ID!
  }

  """Tarefa do kanban"""
  type Task {
    id: ID!          # mapeia _key
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    squadId: ID!
    assigneeId: ID
    assignee: Collaborator        # opcional
    createdAt: String!
    updatedAt: String!
    ownerId: ID!
  }

  # ---------- ROOT TYPES ----------
  type Query {
    _empty: Boolean
    # Helpers (mantidos para seu playground)
    getAllCollaborators: [Collaborator!]!
    getAllSquads: [Squad!]!
    getAllTasks: [Task!]!

    # API principal
    squads: [Squad!]!
    collaborators(filter: CollaboratorFilter): [Collaborator!]!
    tasks(squadId: ID!, assigneeId: ID): [Task!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    createCollaborator(input: CreateCollaboratorInput!): Collaborator!
    createSquad(input: CreateSquadInput!): Squad!
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
    assigneeId: ID
  }
`;

export default typeDefs;
