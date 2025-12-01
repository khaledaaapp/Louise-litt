const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds] 
});

const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

app.listen(5000, () => {
  console.log("Web server running on port 5000");
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('يرد بونج!'),
  
  new SlashCommandBuilder()
    .setName('hello')
    .setDescription('يرحب فيك'),
  
  new SlashCommandBuilder()
    .setName('dev')
    .setDescription('معلومات المطور')
].map(command => command.toJSON());

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!TOKEN) {
  console.error('❌ خطأ: TOKEN غير موجود في البيئة!');
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error('❌ خطأ: DISCORD_CLIENT_ID غير موجود في البيئة!');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function registerCommands() {
  try {
    console.log('🔄 جاري تسجيل الأوامر...');
    
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    
    console.log('✅ الأوامر سجلت بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في التسجيل:', error);
  }
}

client.once('ready', () => {
  console.log(`✅ ${client.user.tag} شغال!`);
  registerCommands();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 **بونج!**');
  }
  
  if (interaction.commandName === 'hello') {
    await interaction.reply(`**مرحبا!** 🎉`);
  }
  
  if (interaction.commandName === 'dev') {
    await interaction.reply('**المطور:** أنت 😎\n**اللغة:** JavaScript');
  }
});

client.login(TOKEN);
