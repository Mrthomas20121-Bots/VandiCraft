const sweetcord = require('sweetcord');
const auth = require('./auth.json');
// Initialize Discord Bot
const ping = require('minecraft-server-util');

const version = require('./package.json').version;

/*var mc = require('minecraft-protocol');
var client = mc.createClient({
  host: "vandiril.craft.gg",   // optional
  port: 14654,         // optional
  username: auth.minecraft.username,
  password: auth.minecraft.password,
});
client.on('chat', function(packet) {
  // Listen for chat messages and echo them back.
  var jsonMsg = JSON.parse(packet.message);
  console.log(jsonMsg);
  if(jsonMsg.translate == 'chat.type.announcement' || jsonMsg.translate == 'chat.type.text') {
    var username = jsonMsg.with[0].text;
    var msg = jsonMsg.with[1];
    if(username === client.username) return;
    client.write('chat', {message: msg});
  }
});
*/
const server = {
  ip:auth.ip,
  port:14654
}
const prefix = "?";

var bot = new sweetcord.SweetClient({
   token: auth.token,
   autorun: true
});
bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    bot.setPresence({
      game: {
        name: `Vandiland version ${version}`,
        type: '0',
        url: null
      }
    });
});
bot.on('message', function (user, userID, channelID, message, event) {
  if (message.startsWith(prefix)) {
      var args = message.slice(prefix.length).split(" ");

    if(args[0] == 'vanilland') {
      ping(server.ip, server.port, (err, res) => {
        if (err) throw err;
        var output = "";
        // for(i=0; i<res.players.sample.length; i++) {
        //   output += res.players.sample[i].name + " "
        //   //console.log(res.players.sample);
        // }
        bot.sendMessage({
          to: channelID,
          embed:{
            title:server.ip,
            color: 0xFBD038,
            timestamp: new Date(),
            footer:{
							icon_url: "",
							text: bot.username
            },
            fields: [
              {
                name:`Players Online: ${res.onlinePlayers}`,
                value:`\n${res.samplePlayers == null ? 'no players online':processPlayers(res.samplePlayers)}`
              },
              {
                name:'Max amount of players:',
                value:res.maxPlayers
              },
              {
                name:'Server version:',
                value:res.version
              }
            ]
          }
        });
      });
    }
  }
});

/**
 * 
 * @param {{id:String,name:String}[]} players 
 */
function processPlayers(players) {
  let res = '';
  if(players.length == 1) {
    res = `**name:**${players[0].name} **id:**${players[0].id}`
  }
  else {
    for(const player of players) {
      res+=`**name:**${player.name} **id:**${player.id}\n`
    }
  }
  return res;
}