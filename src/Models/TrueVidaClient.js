

const {Schema, model} = require('mongoose');

const truevidaclientSchema = new Schema({
    clientid: {type: String},
	nombre: {type: String},
	apellido: {type: String},
	fechaReset: {type: String},
    valorReset: {type: String}
});

module.exports = model('TrueVidaClient', truevidaclientSchema);
