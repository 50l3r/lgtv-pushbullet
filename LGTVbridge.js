"use strict";

const API = require("./lgtv-api.json");
const CONFIG = require("./config.json");
const APPS = require("./apps.json");
const URL = 'ws://' + CONFIG.tvIP + ':3000'

var LGTVBridge = function () {
	var _self = this;

	/**
	 * Conexión inicial
	 */
	this.connectToTV = function () {
		return require("lgtv2")({
			url: URL,
			reconnect: false
		});
	};

	/**
	 * Encender TV
	 */
	this.turnOnTV = function (exitProcess, Callback) {
		const wol = require('wakeonlan')

		wol('38:8C:50:EB:9C:2B').then(() => {
			console.log("Despertando "+CONFIG.tvNAME+"...");
			if (exitProcess){process.exit();}
			if (typeof (Callback) == "function") {
				Callback();
			}
		})
	};

	/**
	 * Apagar TV
	 */
	this.turnOffTV = function (exitProcess) {
		var lgtv = _self.connectToTV();

		lgtv.on("connect", function () {
			lgtv.request(API.TURN_OFF_TV, {}, function (err, res) {
				if (res.returnValue == true){
					console.log("Apagando "+CONFIG.tvNAME+"...");
					lgtv.disconnect();
					if (exitProcess){process.exit();}
				}
			});
		}).on("error", function (err) {
			if (err.code == 'ECONNREFUSED') {
				setTimeout(_self.turnOffTV(), 2000);
			} else {
				console.error("Ocurrió un error en el apagado:", err);
				lgtv.disconnect();
			}
		});
	};

	/**
	 * Ejecutar APP
	 * Si la TV no esta despierta se enciende
	 */
	this.launchApp = function (command, params) {
		APPS.forEach(element => {
			var app = element.displayName.toLowerCase().replace(new RegExp(" ", 'g'),"-");

			if(params.id.toLowerCase()==app){
				_self.turnOnTV(false, function(){
					_self.runRequestFunction(command, {id: element.id});
				})
			}
		});

		_self.runRequestFunction(command, params);
	};

	/**
	 * Ejecutar metodo generico
	 */
	this.execute = function (command, type, params, sendMagicPkg) {
		if (sendMagicPkg === 'sendMagicPkg') {
			_self.turnOnTV();
			_self.runFunction(command, type, params);
		} else {
			_self.runFunction(command, type, params);
		}
	};

	/**
	 * Ejecutar peticion o suscripción
	 */
	this.runFunction = function (command, type, params) {
		if (type == 'request') {
			_self.runRequestFunction(command, params);
		} else {
			_self.runSubscribeFunction(command, params);
		}
	};

	/**
	 * Ejecutar peticion
	 */
	this.runRequestFunction = function (command, params) {
		var lgtv = _self.connectToTV();

		lgtv.on("connect", function () {
			lgtv.request(command, params, function (err, res) {
				console.log('API:', command);
				console.log('Resultados:', res);
				lgtv.disconnect();
			});
		}).on("error", function (err) {
			console.error("Error en la petición", command);
			console.error('ERROR:', err);
			lgtv.disconnect();
		});
	};

	/**
	 * Ejecutar suscripcion
	 */
	this.runSubscribeFunction = function (command, params) {
		var lgtv = _self.connectToTV();

		lgtv.on("connect", function () {
			lgtv.subscribe(command, params, function (err, res) {
				console.log('API:', command);
				console.log('Resultados:', res);
				lgtv.disconnect();
			});
		}).on("error", function (err) {
			console.error("Error en la suscripción", command);
			console.error('ERROR:', err);
			lgtv.disconnect();
		});
	};

}

module.exports = LGTVBridge;
