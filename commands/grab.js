const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "yakala",
  description: "Geçerli şarkıyı Direkt Mesajlarınıza kaydeder",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save","kaydet","yakala"],
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
    if (!player.playing)
      return client.sendTime(
        message.channel,
       "❌ | **Şu anda hiçbir şey çalmıyor...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
       "❌ | **Bir şey çalmak için bir ses kanalında olmalısınız!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
    ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**"
      );
    message.author
      .send(
        new MessageEmbed()
          .setAuthor(
            `Şarkı Kaydedildi.`,
            client.user.displayAvatarURL({
              dynamic: true,
            })
          )
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTitle(`**${player.queue.current.title}**`)
          .addField(
            `⌛ Süre: `,
            `\`${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(`🎵 Yapımcı: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Şarkıyı Çal:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Şuradan kaydedildi:`, `<#${message.channel.id}>`)
          .setFooter(
            `Talep eden: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          )
      )
      .catch((e) => {
        return message.channel.send("**:x: DM'leriniz devre dışı**");
      });

    client.sendTime(message.channel, "✅ | **Dm'lerini kontrol et!**");
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
      const user = client.users.cache.get(interaction.member.user.id);
      const member = guild.members.cache.get(interaction.member.user.id);
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
         "❌ | **Şu anda hiçbir şey çalmıyor...**"
        );
      if (!player.playing)
        return client.sendTime(
          interaction,
         "❌ | **Şu anda hiçbir şey çalmıyor...**"
        );
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Bir şey çalmak için bir ses kanalında olmalısınız!**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**"
        );
      try {
        let embed = new MessageEmbed()
          .setAuthor(`Şarkı Kaydedildi: `, client.user.displayAvatarURL())
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTimestamp()
          .setTitle(`**${player.queue.current.title}**`)
          .addField(
            `⌛ Süre: `,
            `\`${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(`🎵 Yapımcı: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Şarkıyı Çal:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Şuradan kaydedildi:`, `<#${interaction.channel_id}>`)
          .setFooter(
            `Talep eden: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          );
        user.send(embed);
      } catch (e) {
        return client.sendTime(interaction,"**:x: DM'leriniz devre dışı**");
      }

      client.sendTime(interaction, "✅ | **Dm'lerini kontrol et!**");
    },
  },
};
