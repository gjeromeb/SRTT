const BaseCommand = require('../BaseCommand');
const config = require("../../config.json");
const version = require('../../package.json').version

class Help extends BaseCommand {
  constructor() {
    super();
    this.name = 'help';
  }
  execute(args, message, Bot) {
    message.delete().catch(O_o => { });
    let p = config.prefix;
    let msg = [
      `__**Starborne Transit Tracker Help**__ _(v.${version})_`,
      "Allows tracking of resources inbound to the AS",
      "",
      "__Commands__",
      "",
      `**Help:** \`${p}help\``,
      "```Displays this message```",
      "",
      `**Sent:** \`${p}sent [Metal] [Gas] [Crystal] [ETA]\``,
      `\`\`\`Adds a resource transport to the tracker. You may use shorthands for the mineral values such as \"k\". Duration has to be given in the format HH:MM so "7:39" would indicate that your shipment will arrive in 7 hours and 39 minutes.\n You may omit the ETA argument using the "${p}register" command.\n Every resource amount under 500 is automatically treated as having a \"k\"-suffix multiplying the value by 1000.\n Arguments that are omitted are treated as 0.\`\`\``,
      `Example: \`${p}sent 10k 34.5k 20000 0:58\` - 10,000 Metal, 34,500 Gas and 20,000 Crystal will arrive in 58 minutes`,
      `Example: \`${p}sent 81 0 10 2:03\` - 81,000 Metal and 10,000 Crystal will arrive in 2 hours and 3 minutes`,
      `Example: \`${p}sent 0 76\` - Only acceptable once "${p}register duration [ETA]" was used. 76,000 Gas will arrive in your specified default duration.`,
      "",
      `**Status:** \`${p}status [as]\``,
      "```Displays the current status table. Add \"as\" to only show current AS resource values.```",
      "",
      `**Register:** \`${p}register [alliance|duration|mention] [value]\``,
      `\`\`\`Sets up default values for your \"account\".`,
      `Duration will need a duration string such as HH:MM. Once you registered a duration you can omit the information in the "${p}sent" command and given default duration will be used.`,
      `Mention will update your mention preferences e.g. one of your transits finishes. Use "no" to opt-out of that feature.`,
      `\`\`\``,
      "",
      `**Stats:** \`${p}stats\``,
      `\`\`\`Displays the statistics of the current top 10 players by total resources sent.`,
      `\`\`\``,
      "",
      
    ];
    message.channel.send(msg.join("\n"));
    msg = [
      "If you used this tool in the past please leave feedback and/or suggestions using this form:",
      "https://docs.google.com/forms/d/e/1FAIpQLSc-9IGDb6N4xzAUAFeKCIuowI1eyGPqpLGktcIh0IZX5EJvmg/viewform",
      ":heart: Naxvog",
    ]
    message.channel.send(msg.join("\n"));
  }
}

module.exports = Help;
