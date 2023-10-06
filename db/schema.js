const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Equipo {
    nombre: String
    id: ID
  }

  type Query {
    obtenerEquipos: [Equipo]
  }

  input UsuarioInput {
    nombre: String!
    email: String!
    password: String!
  }

  input AutenticarInput {
    email: String!
    password: String!
  }

  input EquipoInput {
    nombre: String!
  }

  type Token {
    token: String
  }

  type Mutation {
    crearUsuario(input: UsuarioInput): String
    autenticarUsuario(input: AutenticarInput): Token
    nuevoEquipo(input: EquipoInput): Equipo
    actualizarEquipo(id: ID!, input: EquipoInput): Equipo
    eliminarEquipo(id: ID!): String
  }
`;

module.exports = typeDefs;
