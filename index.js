"use strict";

const API = require("./lgtv-api.json");
const CONFIG = require("./config.json");
const MyLGTV = require("./LGTVbridge.js");

function __init(command, arg) {
    if(check_config() && check_args(command, arg)){exec(command, arg);}else{return false;}
}

function exec(command, arg) {
    var mylgtv = new MyLGTV();

    switch(command) {
		case "stream":
			if(check_pushbullet()){pushbullet()}else{return false;}
        break;

        case 'launch':
            mylgtv.launchApp(API.APP_LAUNCHER, {"id": arg});
        break;

        case 'close':
            mylgtv.launchApp(API.APP_CLOSER, {"id": arg});
        break;

        case 'play':
            mylgtv.execute(API.PLAY, 'request');
        break;

        case 'pause':
            mylgtv.execute(API.PAUSE, 'request');
        break;

        case 'toast':
            mylgtv.execute(API.TOAST_CREATOR, 'subscribe', {"message": arg});
        break;

        case 'tvoff':
            mylgtv.turnOffTV(true);
        break;

        case 'tvon':
            mylgtv.turnOnTV(true);
        break;

        case 'mute':
            var setMute = (arg == 'true');
            mylgtv.execute(API.MUTE_TV, 'subscribe', {"mute" : setMute});
        break;

        default:

        return;
    }
}

function pushbullet(){
    var PushBullet = require('pushbullet');
    var pusher = new PushBullet(CONFIG.pushbulletToken);

    var stream = pusher.stream();
    stream.on('message', function(message) {
		console.log(message);
        if(message.type=="tickle" && message.subtype=="push"){
            pusher.history({limit: 1}, function(error, response) {
                if(response){
                    if(typeof response.pushes[0].body !== "undefined"){
						console.log("asdasd");
                        var push = response.pushes[0].body;
                        if(push.substr(0,CONFIG.pushbulletClaim.length)==CONFIG.pushbulletClaim){
                            push = push.substr((CONFIG.pushbulletClaim.length + 1), push.length)

                            if(push!="stream"){
								var params = push.split(" ")
								console.log("Ejecutando: "+params[0]+" "+ params[1]);
                                exec(params[0], params[1])
                            }
                        }
                    }
                }
            })
        }
    }).on('close', function() {
        console.log("Desconectando...");
    }).on('error', function(error) {
        console.log("Pusbullet error: "+error);
    });
    stream.connect();
}

function check_config() {
    if (CONFIG.tvMAC === null){
        console.error('\nNo se ha especificado una MAC\n');
        return false;
    }else if (CONFIG.tvIP === null){
        console.error('\nNo se ha especificado una IP\n');
        return false;
	}

    return true;
}

function check_pushbullet(){
	if (CONFIG.pushbulletToken === null || CONFIG.pushbulletClaim === null){
        console.error('\nNo se ha especificado una MAC\n');
        return false;
	}

	return true;
}

function check_args(command, arg) {
    switch(command) {
        case 'launch':
            if(typeof arg != 'undefined')
            return true;
        break;
        case 'close':
            if(typeof arg != 'undefined')
            return true;
        break;
        case 'stream':
        case 'tvoff':
        case 'tvon':
        case 'play':
        case 'pause':
            if(typeof arg == 'undefined')
            return true;
        break;
        case 'toast':
            if(typeof arg == 'string')
            return true;
        break;
        case 'mute':
            if(arg == 'true' || arg == 'false')
            return true;
        break;
        default:
        showInstructions();
        return false;
    }

    showInstructions();
    return false;
}

function showInstructions() {
    console.log('\n*** REMOTE LG Control ***');
    console.log('\nUSO: node index.js <comando> <parametro>');
    console.log('\nPARAMETROS:');
    console.log('\t* lauch "<id>" - Ejecuta una app');
    console.log('\t* close "<id>" - Cierra una app');
    console.log('\t* toast "<mensaje>" - Muestra un mensaje en el TV');
    console.log('\t* tvoff - Apaga la TV');
    console.log('\t* tvon - Enciende la TV\n');
    console.log('\t* mute true|false - Mutea/Desmutea la TV');
    console.log('\t* play - Reproduce el contenido actual');
    console.log('\t* pause - Pausa el contenido actual');
}

__init(process.argv[2], process.argv[3]);









