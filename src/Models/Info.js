

const {Schema, model} = require('mongoose');

const infoSchema = new Schema({
	clientid: {type: String},
	nombre: {type: String},
	apellido: {type: String},
	aua: {type: String},
	fecha: {type: String}
});

module.exports = model('Info', infoSchema);
//Este 'Info' es el que la da el nombre a la collection dentro de Atlas
