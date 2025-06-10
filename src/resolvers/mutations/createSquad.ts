import { gql } from "@apollo/client";

export const CREATE_SQUAD = gql`
  mutation CreateSquad($input: CreateSquadInput!) {
    createSquad(input: $input) {
      id
      name
      description
      createdAt
      archived
    }
  }
`;
