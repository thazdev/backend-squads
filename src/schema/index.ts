import { gql } from 'apollo-server';

const typeDefs = gql`
  type Collaborator {
    _key: ID!
    name: String!
    role: String!
    specialty: String
    squadIds: [String!]  # Armazena os _key dos squads que ele participa
  }

  type Query {
    getAllCollaborators: [Collaborator!]!
  }

  input CollaboratorInput {
    name: String!
    role: String!
    specialty: String
  }

  type Mutation {
    createCollaborator(input: CollaboratorInput!): Collaborator!
  }
`;

export default typeDefs;