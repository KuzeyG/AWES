const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "temizle",
  description: "Sunucu kuyruğunu temizler",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cl", "cls","temizle","sil"],
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

    if (!player.queue || !player.queue.length || player.queue.length === 0)
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
    player.queue.clear();
    await client.sendTime(message.channel, "✅ | **Sıra temizledi!**");
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
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
         "❌ | Bu komutu kullanmak için bir ses kanalında olmalısınız."
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
         ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**"
        );
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Şu anda sırada olan parça bulunamadı...**"
        );

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return client.sendTime(
          interaction,
            "❌ | **Şu anda sırada olan parça bulunamadı...**"
        );
      player.queue.clear();
      await client.sendTime(interaction, "✅ | **Sıra temizledi!**");
    },
  },
};
