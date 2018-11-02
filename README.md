# lgtv-pushbullet
Controla tu televisor LG mediante notificaciones push de Pushbullet, desde cualquier dispositivo o plataforma.

## Requisitos
- node.js
- npm

## Instalación
1. Clonar respositorio
2. Presiona `"Win + R"` y escribe `cmd`
3. Navega hasta la carpeta clonada
2. Ejecuta `npm install`

## Configuración
Abre el archivo `config.json`
- **tvMAC**: Mac del televisor
- **tvIP**: Ip del televisor
- **tvNAME**: Nombre del televisor (Para propósitos informativos)
- **pushbulletToken**: API Token de pushbullet (Obtén el tuyo [aquí](https://www.pushbullet.com/#settings/account))
- **pushbulletClaim**: Cabecera para detectar comandos

## Funciones

**Modo Stream** (Queda a la espera para recibir comandos)<br>
`node index.js stream`

**Encender TV**<br>
`node index.js tvon`

**Apagar TV**<br>
`node index.js tvoff`

**Ejecutar aplicación**<br>
`node index.js launch netflix`

**Cerrar aplicación**<br>
`node index.js close netflix`

**Mutear/Desmutear TV**<br>
`node index.js mute true|false`

**Enviar notificacion a TV**<br>
`node index.js toast 'Mensaje de prueba'`

**Pausar reproducción**<br>
`node index.js play`

**Resumir reproducción**<br>
`node index.js pause`


## Anotaciones

- En el archivo `apps.json` se encuentran los nombres e id's de las aplicaciones. Puedes añadir las que necesites
- El modo stream sirve para quedar a la escucha ante nuevas notificaciones. Es el que necesitas si no vas a ejecutar los comandos manualmente.
- La cabecera de pushbullet sirve para detectar los comandos, por ejemplo, si necesitas encender la TV, la notificación seria `[LGTV] tvon`

## Agradecimientos a

- [lgtv-alexa-skill](https://github.com/lucone83/lgtv-alexa-skill/edit/master/README.md)
