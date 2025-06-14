import { gql } from "apollo-server";

const typeDefs = gql`
<<<<<<< HEAD
  type User {
    id: ID!          
=======
  scalar Upload

  type User {
    id: ID!
>>>>>>> e7ef432a45aebcd7043a73729b403dd322ba4f3a
    name: String!
    email: String!
    bio: String
    avatar: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Collaborator {
<<<<<<< HEAD
    id: ID!        
=======
    id: ID! # mapeia _key
>>>>>>> e7ef432a45aebcd7043a73729b403dd322ba4f3a
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
<<<<<<< HEAD
    id: ID!         
=======
    id: ID!
>>>>>>> e7ef432a45aebcd7043a73729b403dd322ba4f3a
    name: String!
    description: String
    memberIds: [ID!]
    goal: String
    archived: Boolean!
    createdAt: String!
    ownerId: ID!
  }

  type Task {
<<<<<<< HEAD
    id: ID!         
=======
    id: ID! # mapeia _key
>>>>>>> e7ef432a45aebcd7043a73729b403dd322ba4f3a
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    difficulty: Int
    impact: Int
    squadId: ID!
    assigneeId: ID
<<<<<<< HEAD
    assignee: Collaborator  
=======
    assignee: Collaborator
>>>>>>> e7ef432a45aebcd7043a73729b403dd322ba4f3a
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
    me: MePayload
  }

  type MePayload {
    user: User!
    squads: [Squad!]!
    tasksOverall: TasksStats!
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

    updateUser(input: UpdateUserInput!): User!
    uploadAvatar(url: String!): String!
    createTask(input: CreateTaskInput!): Task!
    updateTask(input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }

  # ---------- INPUTS ----------
  input CollaboratorFilter {
    squadId: ID
  }

  input UpdateUserInput {
    name: String
    bio: String
    avatar: String
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
    goal: String
  }

  input UpdateSquadInput {
    id: ID!
    name: String
    description: String
    archived: Boolean
  }

  type TasksStats {
    total: Int!
    pending: Int!
    done: Int!
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
