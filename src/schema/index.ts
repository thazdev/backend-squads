import { gql } from 'apollo-server';

const typeDefs = gql`
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