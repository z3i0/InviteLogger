import { Client, GatewayIntentBits, Events, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, ChannelType, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { storage } from './storage';
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import { any } from 'zod';

const invitesCache = new Map<string, Collection<string, number>>();

async function createWelcomeImage(username: string, avatarUrl: string) {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');

  // Load background
  try {
    const background = await loadImage(path.join(process.cwd(), 'client/public/images/welcome-bg.png'));
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  } catch (err) {
    console.error("Failed to load background image:", err);
    // Fill with a color if background fails
    ctx.fillStyle = '#2c2f33';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw Avatar in Circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(400, 203, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  try {
    const avatar = await loadImage(avatarUrl);
    ctx.drawImage(avatar, 300, 103, 200, 200);
  } catch (err) {
    console.error("Failed to load avatar:", err);
  }
  ctx.restore();

  // Add border to avatar circle
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(400, 203, 100, 0, Math.PI * 2, true);
  ctx.stroke();

  return canvas.toBuffer();
}

export async function startBot() {
  if (!process.env.DISCORD_TOKEN) {
    console.log("No DISCORD_TOKEN provided. Bot will not start.");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildEmojisAndStickers
    ]
  });

  client.once(Events.ClientReady, async (c: any) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    console.log(`Ready! Logged in as ${c.user.tag}`);

    // Register slash commands
    const data = [
      {
        name: 'set-welcome',
        description: 'Set the welcome channel',
        options: [
          {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'The channel where welcome messages will be sent',
            required: true,
            channel_types: [ChannelType.GuildText]
          },
        ],
      },
      {
        name: 'set-language',
        description: 'Set the welcome language',
        options: [
          {
            name: 'lang',
            type: ApplicationCommandOptionType.String,
            description: 'The desired language (ar / en)',
            required: true,
            choices: [
              { name: 'Arabic (العربية)', value: 'ar' },
              { name: 'English', value: 'en' }
            ]
          },
        ],
      },
      {
        name: 'set-autorole',
        description: 'Set the automatic join role',
        options: [
          {
            name: 'role',
            type: ApplicationCommandOptionType.Role,
            description: 'The role to be given to new members',
            required: true,
          },
        ],
      },
      {
        name: 'send-panel',
        description: 'Send the information panel (Embed + Dropdown)',
        options: [
          {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            description: 'The channel where the panel will be sent',
            required: true,
            channel_types: [ChannelType.GuildText]
          },
        ],
      },
      {
        name: 'search-invites',
        description: 'Search for members invited by a specific user',
        options: [
          {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user to search for',
            required: true,
          },
        ],
      },
    ];

    await client.application?.commands.set(data as any);
  });

  client.on(Events.InteractionCreate, async (interaction: any) => {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'set-welcome') {
        if (!interaction.memberPermissions?.has("Administrator")) {
          return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        if (!channel || channel.type !== ChannelType.GuildText) {
          return interaction.reply({ content: "Please select a text channel.", ephemeral: true });
        }

        await storage.setGuildConfig({
          guildId: interaction.guildId!,
          welcomeChannelId: channel.id
        });

        await interaction.reply({ content: `Welcome channel set successfully to: ${channel}`, ephemeral: true });
      }

      if (interaction.commandName === 'set-language') {
        if (!interaction.memberPermissions?.has("Administrator")) {
          return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        const lang = interaction.options.getString('lang') || 'ar';
        await storage.setGuildConfig({
          guildId: interaction.guildId!,
          language: lang
        });

        const msg = lang === 'ar' ? 'Welcome language has been set to Arabic.' : 'Welcome language has been set to English.';
        await interaction.reply({ content: msg, ephemeral: true });
      }

      if (interaction.commandName === 'set-autorole') {
        if (!interaction.memberPermissions?.has("Administrator")) {
          return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        const role = interaction.options.getRole('role');
        if (!role) {
          return interaction.reply({ content: "Please select a valid role.", ephemeral: true });
        }

        await storage.setGuildConfig({
          guildId: interaction.guildId!,
          autoRoleId: role.id
        });

        await interaction.reply({ content: `Automatic join role set successfully to: ${role.name}`, ephemeral: true });
      }

      if (interaction.commandName === 'send-panel') {
        if (!interaction.memberPermissions?.has("Administrator")) {
          return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        if (!channel || channel.type !== ChannelType.GuildText) {
          return interaction.reply({ content: "Please select a valid text channel.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setTitle('Welcome & Information System - Onyx Royal')
          .setDescription(
            `Welcome to Onyx Royal server. Please choose one of the options below for more information.`
          )
          .setColor(0x5865F2)
          .setTimestamp();

        const select = new StringSelectMenuBuilder()
          .setCustomId('info_menu')
          .setPlaceholder('Choose the required information...')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('Rules & Getting Started')
              .setDescription('View rules and the starting channel')
              .setValue('rules')
              .setEmoji('📜'),
            new StringSelectMenuOptionBuilder()
              .setLabel('Details & Information')
              .setDescription('Everything you need to know about the server')
              .setValue('info')
              .setEmoji('ℹ️'),
            new StringSelectMenuOptionBuilder()
              .setLabel('Technical Support')
              .setDescription('How to contact management')
              .setValue('support')
              .setEmoji('🎫')
          );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

        await channel.send({
          embeds: [embed],
          components: [row]
        });

        await interaction.reply({ content: "Panel sent successfully.", ephemeral: true });
      }

      if (interaction.commandName === 'search-invites') {
        const targetUser = interaction.options.getUser('user');
        if (!targetUser) return interaction.reply({ content: "User not found.", ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        try {
          const invitedMembers = await storage.getInvitesByInviter(targetUser.id);

          if (invitedMembers.length === 0) {
            return interaction.editReply({ content: `No members found invited by **${targetUser.username}**.` });
          }

          const embed = new EmbedBuilder()
            .setTitle(`Members invited by ${targetUser.username}`)
            .setColor(0x5865F2)
            .setThumbnail(targetUser.displayAvatarURL())
            .setDescription(
              invitedMembers
                .slice(0, 20) // Limit to top 20 for readability
                .map((log, index) => `${index + 1}. **${log.discordUsername}** (<@${log.discordUserId}>) - <t:${Math.floor(log.joinedAt!.getTime() / 1000)}:R>`)
                .join('\n') + (invitedMembers.length > 20 ? `\n\n*...and ${invitedMembers.length - 20} more members.*` : '')
            )
            .setFooter({ text: `Total Invites: ${invitedMembers.length}` })
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
        } catch (err) {
          console.error("Search error:", err);
          await interaction.editReply({ content: "An error occurred while searching for invites." });
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'info_menu') {
        const value = interaction.values[0];
        let response = "";

        if (value === 'rules') {
          response = "First, please head to [ <#1334969013935280250> ] to read the rules.";
        } else if (value === 'info') {
          response = "This channel is the official and primary reference for every member, containing all important details — please head to [ <#1333217321904377906> ]";
        } else if (value === 'support') {
          response = "Technical support is dedicated to Onyx Royal server only, and for inquiries related to problems or complaints please head to [ <#1439390030500991108> ]";
        }

        await interaction.reply({ content: response, ephemeral: true });
      } else if (interaction.customId === 'role_menu') {
        const roleId = interaction.values[0];
        const role = interaction.guild?.roles.cache.get(roleId);

        if (!role) {
          return interaction.reply({ content: "The role does not exist.", ephemeral: true });
        }

        try {
          if (interaction.member?.roles.cache.has(roleId)) {
            await interaction.member.roles.remove(roleId);
            await interaction.reply({ content: `Successfully removed the **${role.name}** role from you.`, ephemeral: true });
          } else {
            await interaction.member.roles.add(roleId);
            await interaction.reply({ content: `Successfully gave you the **${role.name}** role.`, ephemeral: true });
          }
        } catch (err) {
          console.error("Failed to update role:", err);
          await interaction.reply({ content: "Failed to update role. Please ensure the bot has proper permissions.", ephemeral: true });
        }
      }
    }
  });

  client.on(Events.GuildMemberAdd, async (member: any) => {
    const config = await storage.getGuildConfig(member.guild.id);
    const welcomeChannelId = config?.welcomeChannelId;

    const guild = member.guild;
    const oldInvites = invitesCache.get(guild.id);

    console.log(`[Join] Member ${member.user.tag} (${member.id}) joined ${guild.name}`);

    let usedInvite: any = null;
    try {
      // Check if bot has permission to fetch invites
      const botMember = await guild.members.fetchMe();
      if (!botMember.permissions.has("ManageGuild")) {
        console.warn(`[Join] Bot lacks 'Manage Guild' permission in ${guild.name}. Cannot track standard invites accurately.`);
      }

      const newInvites = await guild.invites.fetch();
      const newCodeUses = new Collection<string, number>();
      newInvites.forEach((inv: any) => newCodeUses.set(inv.code, inv.uses || 0));

      if (oldInvites) {
        usedInvite = newInvites.find((inv: any) => {
          const oldUses = oldInvites.get(inv.code) || 0;
          return (inv.uses || 0) > oldUses;
        });

        if (usedInvite) {
          console.log(`[Join] Found used invite: ${usedInvite.code} by ${usedInvite.inviter?.tag || 'Unknown'}`);
        }
      } else {
        console.warn(`[Join] No old invites in cache for ${guild.name}. Initializing cache now.`);
      }

      // Update cache
      (newCodeUses as any).vanityUses = (oldInvites as any)?.vanityUses || 0;
      invitesCache.set(guild.id, newCodeUses);
    } catch (err) {
      console.error("[Join] Error tracking invite:", err);
    }

    let inviterId: string | null = null;
    let inviterUsername: string | null = null;
    let inviteCode = usedInvite?.code || null;

    if (usedInvite) {
      if (usedInvite.inviter) {
        inviterId = usedInvite.inviter.id;
        inviterUsername = usedInvite.inviter.username;
      } else {
        inviterUsername = "Unknown member (Invite cached but inviter empty)";
      }
    } else if (guild.vanityURLCode) {
      try {
        const vanityData = await guild.fetchVanityData();
        const cache = invitesCache.get(guild.id);
        const oldVanityUses = (cache as any)?.vanityUses || 0;

        if (vanityData.uses > oldVanityUses) {
          inviteCode = guild.vanityURLCode;
          inviterUsername = "Public invite";
          if (cache) (cache as any).vanityUses = vanityData.uses;
        }
      } catch (err) {
        // Fallback for vanity error
        inviterUsername = "Unknown member (Vanity check failed)";
      }
    }

    // If still unknown, try a final fallback
    if (!inviterUsername) {
      inviterUsername = "Unknown member";
    }

    // Log to database
    try {
      await storage.logJoin({
        discordUserId: member.id,
        discordUsername: member.user.username,
        discordAvatarUrl: member.user.displayAvatarURL({ extension: 'png', size: 128 }),
        inviterId: inviterId,
        inviterUsername: inviterUsername,
        inviteCode: inviteCode || (inviterUsername === "Public invite" ? guild.vanityURLCode : null)
      });
      console.log(`[Join] Logged join for ${member.user.username} (Inviter: ${inviterUsername})`);
    } catch (dbErr) {
      console.error("[Join] Failed to log to database:", dbErr);
    }

    if (welcomeChannelId) {
      const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
      if (welcomeChannel?.isTextBased()) {
        const welcomeMessage =
          `أهلاً بك <@${member.id}> في Onyx Royal <:11OnyxRoyal:1473114510025031700> ، يرجى البدء بمراجعة أقسام الـ <#1334969013935280250>  , <#1333217321904377906> \n` +
          `كمرجعك الأساسي لكل التفاصيل\n` +
          `وفي حال واجهت أي مشكلة أو كان لديك استفسار، يرجى التوجه مباشرة لقسم الـ <#1439390030500991108> .`;

        // Generate welcome embed and dropdown
        try {
          // const welcomeEmbed = new EmbedBuilder()
          //   .setTitle('Welcome to Onyx Royal')
          //   .setDescription(welcomeMessage)
          //   .setColor(0x5865F2)
          //   .setThumbnail(member.user.displayAvatarURL())
          //   .setTimestamp();

          // const welcomeSelect = new StringSelectMenuBuilder()
          //   .setCustomId('info_menu')
          //   .setPlaceholder('Choose the required information...')
          //   .addOptions(
          //     new StringSelectMenuOptionBuilder()
          //       .setLabel('Rules & Getting Started')
          //       .setDescription('View rules and the starting channel')
          //       .setValue('rules')
          //       .setEmoji('📜'),
          //     new StringSelectMenuOptionBuilder()
          //       .setLabel('Details & Information')
          //       .setDescription('Everything you need to know about the server')
          //       .setValue('info')
          //       .setEmoji('ℹ️'),
          //     new StringSelectMenuOptionBuilder()
          //       .setLabel('Technical Support')
          //       .setDescription('How to contact management')
          //       .setValue('support')
          //       .setEmoji('🎫')
          //   );

          // const welcomeRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(welcomeSelect);

          // (welcomeChannel as any).send({
          //   embeds: [welcomeEmbed],
          //   components: [welcomeRow]
          // }).catch(console.error);
          (welcomeChannel as any).send({
            content: welcomeMessage
          }).catch(console.error)
        } catch (err) {
          console.error("Failed to send welcome interaction:", err);
          (welcomeChannel as any).send({
            content: welcomeMessage
          }).catch(console.error);
        }
      }
    }

    /* Auto-role assignment disabled by request
    try {
      const botRoleId = "1439329655793385675";
      const memberRoleId = "1333225938854477826";
      const roleId = member.user.bot ? botRoleId : memberRoleId;

      const role = member.guild.roles.cache.get(roleId);
      if (role) {
        await member.roles.add(role);
        console.log(`Assigned role ${role.name} to ${member.user.username}`);
      }

      // Also check if there's a custom auto-role set via command
      if (config?.autoRoleId && config.autoRoleId !== roleId) {
        const customRole = member.guild.roles.cache.get(config.autoRoleId);
        if (customRole) {
          await member.roles.add(customRole);
        }
      }
    } catch (err) {
      console.error("Failed to assign auto-role:", err);
    }
    */
  });

  client.on(Events.InviteCreate, (invite) => {
    const guildInvites = invitesCache.get(invite.guild?.id || "");
    if (guildInvites) {
      guildInvites.set(invite.code, invite.uses || 0);
    }
  });

  await client.login(process.env.DISCORD_TOKEN);
  return client;
}

export let discordClient: Client | null = null;

export async function initBot() {
  discordClient = await startBot() as any;
  return discordClient;
}

export async function sendPanel(data: any) {
  if (!discordClient) throw new Error("Bot not initialized");

  const { channelId, title, description, color, thumbnail, options } = data;
  const channel = await discordClient.channels.fetch(channelId);

  if (!channel || !channel.isTextBased()) {
    throw new Error("Channel not found or not text-based");
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(parseInt(color.replace("#", "0x")) || 0x5865F2)
    .setTimestamp();

  if (thumbnail) {
    embed.setThumbnail(thumbnail);
  }

  const select = new StringSelectMenuBuilder()
    .setCustomId('role_menu')
    .setPlaceholder('Choose your role...')
    .addOptions(
      options.map((opt: any) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(opt.label)
          .setDescription(opt.description || "")
          .setValue(opt.roleId)
          .setEmoji(opt.emoji || "🏷️")
      )
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  await (channel as any).send({
    embeds: [embed],
    components: [row]
  });
}
