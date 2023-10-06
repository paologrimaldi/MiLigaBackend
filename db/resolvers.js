const Usuario = require("../models/Usuario");
const Equipo = require("../models/Equipo");
const Jugador = require("../models/Jugador");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secret, expiresIn) => {
  const { id, email } = usuario;

  return jwt.sign({ id, email }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    obtenerEquipos: async (_, {}, ctx) => {
      const equipos = await Equipo.find({ creador: ctx.usuario.id });
      return equipos;
    },
    obtenerJugadores: async (_, {}, ctx) => {
      const jugadores = await Jugador.find({ creador: ctx.usuario.id });
      return jugadores;
    },
  },
  Mutation: {
    crearUsuario: async (_, { input }) => {
      const { email, password } = input;
      const existeUsuario = await Usuario.findOne({ email });
      console.log(existeUsuario);
      if (existeUsuario) {
        throw new Error("Usuario ya registrado");
      }

      try {
        //hash pass
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);
        const nuevoUsuario = new Usuario(input);
        console.log(nuevoUsuario);
        nuevoUsuario.save();
        return "Usuario Creado correctamente";
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      //revisar si existe el usuario
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }
      //revisar si password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error("Password incorrecto");
      }

      //dar acceso
      return {
        token: crearToken(existeUsuario, process.env.SECRET, "2hr"),
      };
    },

    nuevoEquipo: async (_, { input }, ctx) => {
      try {
        const equipo = new Equipo(input);

        //asociar el creador
        equipo.creador = ctx.usuario.id;

        const resultado = await equipo.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarEquipo: async (_, { id, input }, ctx) => {
      try {
        //revisar si el equipo existe
        let equipo = await Equipo.findById(id);

        if (!equipo) {
          throw new Error("Equipo no encontrado");
        }
        //revisar si la persona que edita es el creador
        console.log(equipo);

        if (equipo.creador.toString() !== ctx.usuario.id) {
          throw new Error("no tienes las credenciales para editar");
        }
        //guardar el equipo
        equipo = await Equipo.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return equipo;
      } catch (error) {
        console.log(error);
      }
    },
    eliminarEquipo: async (_, { id }, ctx) => {
      try {
        //revisar si el equipo existe
        let equipo = await Equipo.findById(id);

        if (!equipo) {
          throw new Error("Equipo no encontrado");
        }
        //revisar si la persona que edita es el creador

        if (equipo.creador.toString() !== ctx.usuario.id) {
          throw new Error("no tienes las credenciales para editar");
        }
        //guardar el equipo
        equipo = await Equipo.findOneAndDelete({ _id: id });

        return "Equipo eliminado correctamente";
      } catch (error) {
        console.log(error);
      }
    },

    nuevoJugador: async (_, { input }, ctx) => {
      try {
        const jugador = new Jugador(input);

        //asociar el creador
        jugador.creador = ctx.usuario.id;

        const resultado = await jugador.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarJugador: async (_, { id, input }, ctx) => {
      try {
        //revisar si el equipo existe
        let jugador = await Jugador.findById(id);

        if (!jugador) {
          throw new Error("Jugador no encontrado");
        }
        //revisar si la persona que edita es el creador

        if (jugador.creador.toString() !== ctx.usuario.id) {
          throw new Error("no tienes las credenciales para editar");
        }
        //guardar el equipo
        jugador = await Jugador.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return jugador;
      } catch (error) {
        console.log(error);
      }
    },
    eliminarJugador: async (_, { id }, ctx) => {
      try {
        //revisar si el equipo existe
        let jugador = await Jugador.findById(id);

        if (!jugador) {
          throw new Error("Proyecto no encontrado");
        }
        //revisar si la persona que edita es el creador

        if (jugador.creador.toString() !== ctx.usuario.id) {
          throw new Error("no tienes las credenciales para editar");
        }
        //guardar el equipo
        jugador = await Jugador.findOneAndDelete({ _id: id });

        return "Jugador eliminado correctamente";
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = resolvers;
