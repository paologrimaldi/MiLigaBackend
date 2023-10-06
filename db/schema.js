const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Equipo {
    nombre: String
    id: ID
  }

  type Jugador {
    nombre: String
    id: ID
  }

  type Query {
    obtenerEquipos: [Equipo]
    obtenerJugadores: [Jugador]
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

  input JugadorInput {
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

    nuevoJugador(input: JugadorInput): Jugador
    actualizarJugador(id: ID!, input: JugadorInput): Jugador
    eliminarJugador(id: ID!): String
  }
`;

module.exports = typeDefs;
