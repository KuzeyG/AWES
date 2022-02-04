const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "loop",
  description: "Geçerli şarkıyı döngüye al ",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["l", "repeat","tekrar"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Şu anda hiçbir şey çalmıyor...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Bu komutu kullanmak için bir ses kanalında olmalısınız! **"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**"
      );

    if (player.trackRepeat) {
      player.setTrackRepeat(false);
      client.sendTime(message.channel, `🔂  \`Kapalı\``);
    } else {
      player.setTrackRepeat(true);
      client.sendTime(message.channel, `🔂 \`Açık\``);
    }
  },
  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Şu anda hiçbir şey çalmıyor...**"
        );
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | Bu komutu kullanmak için bir ses kanalında olmalısınız ."
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız! **"
        );

      if (player.trackRepeat) {
        player.setTrackRepeat(false);
        client.sendTime(interaction, `🔂 \`Kapalı\``);
      } else {
        player.setTrackRepeat(true);
        client.sendTime(interaction, `🔂 \`Açık\``);
      }
      console.log(interaction.data);
    },
  },
};
