const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "yardim",
  description: "Bot hakkında bilgi",
  usage: "[komut]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd","help","yardim"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
      .setAuthor(
        `${client.user.username} Bot komutları `,
        client.botconfig.IconURL
      )
      .setColor(client.botconfig.EmbedColor)
      .setFooter(
        `Antidaü Müzik Botu Sürüm: v${require("../package.json").version}`, "https://www.freelogovectors.net/wp-content/uploads/2020/08/dogu-akdeniz-universitesi-logo.png"
      ).setDescription(`${Commands.join("\n")}
  
  Her komut türü hakkında bilgi almak için ${
          GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
        }yardim [komut].`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(
          message.channel,
          `❌ | Bu komut bulunamadı.`
        );

      let embed = new MessageEmbed()
        .setAuthor(`Komut: ${cmd.name}`, client.botconfig.IconURL)
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Name", cmd.name, true)
        .addField("Aliases", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Usage",
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Permissions",
          "Member: " +
            cmd.permissions.member.join(", ") +
            "\nBot: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Prefix - ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }`
        );

      message.channel.send(embed);
    }
  },

  SlashCommand: {
    options: [
      {
        name: "komut",
        description: "Belirli bir komut hakkında bilgi alın",
        value: "komut",
        type: 3,
        required: false,
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    run: async (client, interaction, args, { GuildDB }) => {
      let Commands = client.commands.map(
        (cmd) =>
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
      );

      let Embed = new MessageEmbed()
        .setAuthor(
          `Komut :  ${client.user.username}`,
          client.botconfig.IconURL
        )
        .setColor(client.botconfig.EmbedColor)
        .setFooter(
          `Her komut türü hakkında bilgi almak için ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }yardim [komut].`
        ).setDescription(`${Commands.join("\n")}
  
  Antidaü Music Bot Version: v${require("../package.json").version}
  [✨ Support Server](${
    client.botconfig.SupportServer
  }) | [GitHub](https://github.com/SudhanPlayz/Discord-MusicBot) | By [SudhanPlayz](https://github.com/SudhanPlayz)`);
      if (!args) return interaction.send(Embed);
      else {
        let cmd =
          client.commands.get(args[0].value) ||
          client.commands.find(
            (x) => x.aliases && x.aliases.includes(args[0].value)
          );
        if (!cmd)
          return client.sendTime(
            interaction,
            `❌ | Bu komut bulunamadı.`
          );

        let embed = new MessageEmbed()
          .setAuthor(`Komut: ${cmd.name}`, client.botconfig.IconURL)
          .setDescription(cmd.description)
          .setColor("GREEN")
          //.addField("Name", cmd.name, true)
          .addField("Aliases", cmd.aliases.join(", "), true)
          .addField(
            "Usage",
            `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
              cmd.name
            }\`${cmd.usage ? " " + cmd.usage : ""}`,
            true
          )
          .addField(
            "Permissions",
            "Member: " +
              cmd.permissions.member.join(", ") +
              "\nBot: " +
              cmd.permissions.channel.join(", "),
            true
          )
          .setFooter(
            `Prefix - ${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }`
          );

        interaction.send(embed);
      }
    },
  },
};
