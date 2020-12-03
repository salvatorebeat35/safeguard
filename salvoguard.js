const { Discord, Client, MessageEmbed } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const ayarlar = require('./ayarlar.json');
const fs = require('fs');




//--------------------------BOT DURUM MESAJI - SES KANALI--------------------------\\
client.on("ready", async () => {
  client.user.setPresence({ activity: { name: "Salvo Code | v12 Guard Botu" }, status: "idle" });
  let botVoiceChannel = client.channels.cache.get(ayarlar.botseskanali);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Ses Kanalına Bağlanamadım"));
});
//--------------------------BOT DURUM MESAJI - SES KANALI--------------------------\\





client.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar.botPrefix)) return;
  if (message.author.id !== ayarlar.botOwner && message.author.id !== message.guild.owner.id) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(ayarlar.botPrefix.length);
  let embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, })).setFooter(`Safe Code - Salvo Code ❤️ Salvatore`)
  
  
  
  
  
//--------------------------EVAL--------------------------\\
  if (command === "eval" && message.author.id === ayarlar.botOwner) {
    if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
      let salvocode = args.join(' ');
      function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try { 
      var evaled = clean(await eval(salvocode));
      if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
      message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
    } catch(err) { message.channel.send(err, {code: "js", split: true}) };
  };
//--------------------------EVAL--------------------------\\
  
  
  
  
  
//--------------------------GÜVENLİ LİSTE--------------------------\\
  if(command === "güvenli") {
    let hedef;
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (rol) hedef = rol;
    if (uye) hedef = uye;
    let guvenliler = ayarlar.whitelist || [];
    if (!hedef) return message.channel.send(new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, }))
    .setDescription(`Güvenli Listeye Bir Kullanıcı Eklemek/Çıkarmak İçin Bir Rol/Kullanıcı Etiketleyiniz`)
    .addField("Güvenli Liste", guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) : g).join('\n') : "Güvenli Listede Kimse Yok"))
    .setFooter("Salvo Code - Guard Botu")
    if (guvenliler.some(g => g.includes(hedef.id))) {
      guvenliler = guvenliler.filter(g => !g.includes(hedef.id));
      ayarlar.whitelist = guvenliler;
      fs.writeFile("./ayarlar.json", JSON.stringify(ayarlar), (err) => {
        if (err) console.log(err);
      });
      const güvenlikaldir = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, }))
    .setDescription(`${hedef}, ${message.author} Tarafından Güvenli Listeden Kaldırıldı!`)    
    .setFooter("Salvo Code - Guard Botu")
      message.channel.send(güvenlikaldir);
    } else {
      ayarlar.whitelist.push(`y${hedef.id}`);
      fs.writeFile("./ayarlar.json", JSON.stringify(ayarlar), (err) => {
        if (err) console.log(err);
      });
      const güvenliekle = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, }))
    .setDescription(`${hedef}, ${message.author} Tarafından Güvenli Listeye Eklendi`)    
    .setFooter("Salvo Code - Guard Botu")
      message.channel.send(güvenliekle);
    };
  };
//--------------------------GÜVENLİ LİSTE--------------------------\\
  
  
  
  
  
  
  
//--------------------------KORUMALAR--------------------------\\
  if(command === "koruma")  {
    let korumalar = Object.keys(ayarlar).filter(k => k.includes('Guard'));
    if (!args[0] || !korumalar.some(k => k.includes(args[0]))) return message.channel.send(new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, }))
    .setDescription(`Korumaları Aktif Etmek veya Devre Dışı Bırakmak İçin \`${ayarlar.botPrefix}koruma <koruma>\` Yazmanız Yeterlidir!`))
    .addField("Korumalar",`${korumalar.map(k => `\`${k}\``).join('\n')}`)
    .addField("Aktif Korumalar",`${korumalar.filter(k => ayarlar[k]).map(k => `\`${k}\``).join('\n')}`)
    .setFooter("Salvo Code - Guard Botu")
    let koruma = korumalar.find(k => k.includes(args[0]));
    ayarlar[koruma] = !ayarlar[koruma];
    fs.writeFile("./ayarlar.json", JSON.stringify(ayarlar), (err) => {
      if (err) console.log(err);
    });
    const korumaişlem = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, }))
    .setDescription(`\`${koruma}\` Koruması, ${message.author} Tarafından ${ayarlar[koruma] ? "Aktif Edildi" : "Devre Dışı Bırakıldı"}!`)
    .setFooter("Salvo Code - Guard Botu")
    message.channel.send(korumaişlem)
  };
});
//--------------------------KORUMALAR--------------------------\\








//--------------------------GÜVENLİ KULLANICI TANIMLAMA--------------------------\\
function guvenli(kisiID) {
  let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
  let guvenliler = ayarlar.whitelist || [];
  if (!uye || uye.id === client.user.id || uye.id === ayarlar.botOwner || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
  else return false;
};
//--------------------------GÜVENLİ KULLANICI TANIMLAMA--------------------------\\







//--------------------------CEZALANDIRMA--------------------------\\
const yetkiPermleri = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS"];
function cezalandir(kisiID, tur) {
  let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
  if (!uye) return;
  if (tur == "jail") return uye.roles.cache.has(ayarlar.boosterRole) ? uye.roles.set([ayarlar.boosterRole, ayarlar.jailRole]) : uye.roles.set([ayarlar.jailRole]);
  if (tur == "ban") return uye.ban({ reason: "Salvo Code - Guard Koruma Sistemi" }).catch();
};
//--------------------------CEZALANDIRMA--------------------------\\




//--------------------------SAĞ TIK KİCK KORUMASI--------------------------\\
client.on("guildMemberRemove", async member => {
  let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.kickGuard) return;
  cezalandir(entry.executor.id, "ban");
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Yetkili ${member} İsimli Kullanıcıyı Sağ Tık Kullanarak Sunucudan Kickledi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlem",`${entry.executor} İsimli Kullanıcı Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`))
} else { 
member.guild.owner.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Yetkili ${member} İsimli Kullanıcıyı Sağ Tık Kullanarak Sunucudan Kickledi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlem",`${entry.executor} İsimli Kullanıcı Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)).catch(err => {}); };
});
//--------------------------SAĞ TIK KİCK KORUMASI--------------------------\\






//--------------------------SAĞ TIK BAN KORUMASI--------------------------\\
client.on("guildBanAdd", async (guild, user) => {
  let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !ayarlar.banGuard) return;
   cezalandir(entry.executor.id, "ban");
  guild.members.unban(user.id, "Sağ Tık İle Banlandığı İçin Geri Açıldı!").catch(console.error);
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Yetkili ${user} İsimli Kullanıcıyı Sağ Tık Kullanarak Sunucudan Banladı Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlem",`${entry.executor} İsimli Kullanıcı Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)).catch(); 
} else { 
guild.owner.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Yetkili ${user} İsimli Kullanıcıyı Sağ Tık Kullanarak Sunucudan Banladı Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlem",`${entry.executor} İsimli Kullanıcı Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)).catch(err => {}); };
});
//--------------------------SAĞ TIK KİCK KORUMASI--------------------------\\




//--------------------------BOT KORUMASI--------------------------\\
client.on("guildMemberAdd", async member => {
  let entry = await member.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
  if (!member.user.bot || !entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.botGuard) return;
  cezalandir(entry.executor.id, "ban");
  cezalandir(member.id, "ban");
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı ${member} İsimli Botu Sunucuya Ekledi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Sunucudan Banlandı \n${member} - Sunucundan Banlandı `)
.setFooter(`Salvo Code - v12 Guard Botu`)
.setTimestamp()).catch(); } else { 
member.guild.owner.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı ${member} İsimli Botu Sunucuya Ekledi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Sunucudan Banlandı \n${member} - Sunucundan Banlandı `)
.setFooter(`Salvo Code - v12 Guard Botu`)
.setTimestamp()).catch(err => {}); };
});
//--------------------------BOT KORUMASI--------------------------\\





//--------------------------SUNUCU AYARLARI KORUMASI--------------------------\\
client.on("guildUpdate", async (oldGuild, newGuild) => {
  let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.serverGuard) return;
  cezalandir(entry.executor.id, "ban");
  if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
  if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı Tarafından Sunucu Güncellendi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Sunucudan Banlandı`)
.setFooter(`Salvo Code - v12 Guard Botu`)                                
.setTimestamp()).catch(); } else { newGuild.owner.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı Tarafından Sunucu Güncellendi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Sunucudan Banlandı`)
.setFooter(`Salvo Code - v12 Guard Botu`)
.setTimestamp()).catch(err => {}); };
});
//--------------------------SUNUCU AYARLARI KORUMASI--------------------------\\




//--------------------------KANAL KORUMA - KANAL AÇMA ENGEL --------------------------\\
client.on("channelCreate", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
  channel.delete({reason: "Salvo Code Kanal Koruma"});
  cezalandir(entry.executor.id, "jail");
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı Tarafından Kanal Oluşturuldu Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)
.setTimestamp()).catch(); 
} else { channel.guild.owner.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı Tarafından Kanal Oluşturuldu Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)
.setTimestamp()).catch(err => {}); };
});
//--------------------------KANAL KORUMA - KANAL AÇMA ENGEL --------------------------\\




//--------------------------KANAL KORUMA - KANAL GÜNCELLEME ENGEL --------------------------\\
client.on("channelUpdate", async (oldChannel, newChannel) => {
  let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || !newChannel.guild.channels.cache.has(newChannel.id) || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
  cezalandir(entry.executor.id, "jail");
  if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
  if (newChannel.type === "category") {
    newChannel.edit({
      name: oldChannel.name,
    });
  } else if (newChannel.type === "text") {
    newChannel.edit({
      name: oldChannel.name,
      topic: oldChannel.topic,
      nsfw: oldChannel.nsfw,
      rateLimitPerUser: oldChannel.rateLimitPerUser
    });
  } else if (newChannel.type === "voice") {
    newChannel.edit({
      name: oldChannel.name,
      bitrate: oldChannel.bitrate,
      userLimit: oldChannel.userLimit,
    });
  };
  oldChannel.permissionOverwrites.forEach(perm => {
    let thisPermOverwrites = {};
    perm.allow.toArray().forEach(p => {
      thisPermOverwrites[p] = true;
    });
    perm.deny.toArray().forEach(p => {
      thisPermOverwrites[p] = false;
    });
    newChannel.createOverwrite(perm.id, thisPermOverwrites);
  });
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı Tarafından **${oldChannel.name}** Kanalı Güncellendi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)
.setTimestamp()).catch(); 
} else { newChannel.guild.owner.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı Tarafından **${oldChannel.name}** Kanalı Güncellendi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)
.setTimestamp()).catch(err => {}); };
});
//--------------------------KANAL KORUMA - KANAL GÜNCELLEME ENGEL --------------------------\\





//--------------------------KANAL KORUMA - KANAL SİLME ENGEL --------------------------\\
client.on("channelDelete", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
  cezalandir(entry.executor.id, "ban");
  await channel.clone({ reason: "Salvo Code Kanal Koruma" }).then(async kanal => {
    if (channel.parentID != null) await kanal.setParent(channel.parentID);
    await kanal.setPosition(channel.position);
    if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
  });
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı Tarafından **${channel.name}** Kanalı Silindi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)).catch(); 
} else { channel.guild.owner.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`${entry.executor} İsimli Kullanıcı Tarafından **${channel.name}** Kanalı Silindi Gerekli İşlemler Yapıldı`)
.addField("Yapılan İşlemler",`${entry.executor} - Jail'e Atıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)).catch(err => {}); };
});
//--------------------------KANAL KORUMA - KANAL SİLME ENGEL --------------------------\\




//--------------------------YETKİ KAPATMA FONKSİYONU--------------------------\\
function ytKapat(guildID) {
  let sunucu = client.guilds.cache.get(guildID);
  if (!sunucu) return;
  sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
    await r.setPermissions(0);
  });
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed()
.setColor("RANDOM")
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`Rollerin Yetkileri Kapatıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)).catch(); 
} else { client.guild.owner.send(new MessageEmbed()
.setAuthor(client.member.displayName, client.author.avatarURL({ dynamic: true, }))
.setDescription(`Rollerin Yetkileri Kapatıldı`)
.setFooter(`Salvo Code - v12 Guard Botu`)).catch(err => {}); };
};
//--------------------------YETKİ KAPATMA FONKSİYONU--------------------------\\




client.login(ayarlar.botToken).then(c => console.log(`${client.user.tag} Giriş Başarılı [Salvo Code]`)).catch(err => console.error("Bot Giriş Yaparken Bir Hata Oluştu"));
