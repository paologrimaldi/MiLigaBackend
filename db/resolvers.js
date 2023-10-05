const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const resolvers = {
  Query: {},
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
  },
};

module.exports = resolvers;
