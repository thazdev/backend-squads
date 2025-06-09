import { gql } from 'apollo-server';

const typeDefs = gql`

  type User {
    _key: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Collaborator {
    _key: ID!
    name: String!
    role: String!
    specialty: String
    squadIds: [String!]
  }

  type Squad {
    _key: ID!
    name: String!
    description: String
    memberIds: [String!]!
  }

  type Query {
    _: Boolean
    getAllCollaborators: [Collaborator!]!
    getAllSquads: [Squad!]!
    getAllTasks: [Task!]!
  }

  input CollaboratorInput {
    name: String!
    role: String!
    specialty: String
  }

  input SquadInput {
    name: String!
    description: String
    memberIds: [String!]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createCollaborator(input: CollaboratorInput!): Collaborator!
    createSquad(input: SquadInput!): Squad!
    createTask(input: TaskInput!): Task!
  }

  type Task {
  _key: ID!
  title: String!
  type: TaskType!
  status: TaskStatus!
  assigneeId: String!
  squadId: String
}


  enum TaskType {
  LIGACAO
  TAREFA
  REUNIAO
  EMAIL
}

enum TaskStatus {
  A_FAZER
  FAZENDO
  FEITO
}

input TaskInput {
  title: String!
  type: TaskType!
  status: TaskStatus!
  assigneeId: String!
  squadId: String
}
`;

export default typeDefs;