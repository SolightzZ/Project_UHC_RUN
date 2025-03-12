import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { dynamicToast } from "./message.js";

const TEAMS = [
  { id: "team1", color: "§c", name: "Red", icon: "textures/items/dye_powder_red" },
  { id: "team2", color: "§9", name: "Blue", icon: "textures/items/dye_powder_blue_new" },
  { id: "team3", color: "§g", name: "Yellow", icon: "textures/items/dye_powder_yellow" },
  { id: "team4", color: "§a", name: "Green", icon: "textures/items/dye_powder_lime" },
  { id: "team5", color: "§5", name: "Purple", icon: "textures/items/dye_powder_purple" },
  { id: "team6", color: "§b", name: "Aqua", icon: "textures/items/dye_powder_light_blue" },
  { id: "team7", color: "§6", name: "Orange", icon: "textures/items/dye_powder_orange" },
  { id: "team8", color: "§7", name: "Gray", icon: "textures/items/dye_powder_silver" },
  { id: "team9", color: "§d", name: "Pink", icon: "textures/items/dye_powder_pink" },
];

async function showTeamMenu(player) {
  const form = new ActionFormData()
    .title("§g§r")
    .body("§7Sleeplite Event UHC§6Run§7 2025 \nx WFD & Titan Town")
    .button("SPAWN", "textures/items/dragons_breath");

  TEAMS.forEach((team) => form.button(`${team.color}${team.name} Team`, team.icon));
  form.button("Emotes", "textures/ui/sidebar_icons/emotes.png");
  if (player.hasTag("Admin")) {
    form.button("Show Menu", "textures/ui/sidebar_icons/csb_sidebar_icon");
  }

  const response = await form.show(player);
  if (response && !response.canceled) {
    await handleMenuSelection(player, response.selection);
  }
}

async function handleMenuSelection(player, selection) {
  if (selection === 0) return handleSpawn(player);
  if (selection <= TEAMS.length) return handleTeamSelection(player, TEAMS[selection - 1]);
  if (selection === TEAMS.length + 1) return showEmoteMenu(player);
  if (selection === TEAMS.length + 2 && player.hasTag("Admin")) return showMenu(player);
}

async function handleTeamSelection(player, team) {
  if (!player.hasTag(team.id)) {
    world.sendMessage(dynamicToast(`${team.color}${team.name} Team §7- ${player.name}`, team.icon));
  }
  await player.runCommandAsync(`function team/addteam_${team.id.slice(-1)}`);
}

async function handleSpawn(player) {
  await player.runCommandAsync("spreadplayers 596 622 0 1 @s");
  await player.playSound("random.enderchestopen", { volume: 0.9, pitch: 0.95 });
  const { x, y, z } = player.location;
  await player.dimension.spawnParticle("so:light2", { x, y: y + 5, z });
}

async function showMenu(player) {
  const form = new ActionFormData()
    .title("Show Menu")
    .button("Player list", "textures/ui/sidebar_icons/genre")
    .button("Kill list", "textures/ui/sidebar_icons/character_creator")
    .button("Compass", "textures/items/compass_item")
    .button("Spawn", "textures/ui/sidebar_icons/dressing_room_customization")
    .button("@a", "textures/ui/sidebar_icons/dressing_room_skins");
  const response = await form.show(player);
  if (response && !response.canceled) {
    await handleAdminSelection(player, response.selection);
  }
}

async function handleAdminSelection(player, selection) {
  const actions = [
    () => sendPlayerList(),
    () => sendKillList(),
    () => player.runCommandAsync("function sets/compass"),
    () => player.runCommandAsync("spreadplayers 596 622 0 1 @a"),
    () => teleportAllPlayersTo(player),
  ];
  if (selection < actions.length) await actions[selection]();
}

async function admin_(player) {
  const admin = new ActionFormData();
  admin.title("Admin Menu");
  admin.button("§9Reset Team", "textures/ui/sidebar_icons/my_characters");
  admin.button("§cGame End [!]", "textures/ui/sidebar_icons/capes");
  admin.button("§bSetup [!]", "textures/ui/sidebar_icons/addon");
  admin.button("§qGame Start", "textures/ui/sidebar_icons/realms");
  const response = await admin.show(player);
  if (response && !response.canceled) {
    await admin_selection(player, response.selection);
  }
}

async function admin_selection(player, selection) {
  const actions = [
    () => player.runCommandAsync("function team/clearAll"),
    () => player.runCommandAsync("function games/end"),
    () => player.runCommandAsync("function setup"),
    () => player.runCommandAsync("function games/start"),
  ];
  if (selection < actions.length) await actions[selection]();
}

async function teleportAllPlayersTo(player) {
  const { location } = player;

  for (const target of world.getAllPlayers()) {
    target.teleport(location, {
      rotation: { x: 0, y: player.getRotation()?.y ?? 0 },
      keepVelocity: false,
    });
  }
}

async function sendPlayerList() {
  let message = "§8----- §gUHCRun Team §8-----§f\n";
  for (const team of TEAMS) {
    const players = [...world.getPlayers({ tags: [team.id] })];
    if (players.length > 0) {
      message += `${team.color}${team.name} ${players.length}: ${players
        .map((p) => p.name)
        .join(", ")}\n`;
    }
  }
  world.sendMessage(message);
}

async function sendKillList() {
  const scoreboard = world.scoreboard;
  let kills = scoreboard.getObjective("kills") || scoreboard.addObjective("kills", "Kills");
  let message = "§8----- §gUHCRun Kills §8-----§f\n";
  for (const player of world.getPlayers()) {
    const score = kills.getScore(player) ?? 0;
    message += ` §7§l\u00BB §r§f${player.name} §c${score} kill\n`;
  }
  world.sendMessage(message);
}

async function showEmoteMenu(player) {
  const form = new ActionFormData()
    .title("§g§rEmotes")
    .button("Clear Emote", "textures/ui/csbChevronArrowLarge");

  const emotes = [
    "Dab|animation.humanoid.custom.dab",
    "Twerking|animation.humanoid.custom.perreo",
    "LMAO|animation.humanoid.custom.risa",
    "Cry|animation.humanoid.custom.llorar",
    "Desperate|animation.humanoid.desesperado",
    "T - Pose|animation.humanoid.t-pose",
    "Slap|animation.humanoid.customm.cachetada",
    "Flip|animation.humanoid.flip_atras",
    "Throwing Money|animation.humanoid.melapelas",
    "Floss|animation.humanoid.baile",
    "Champion|animation.humanoid.customm.campeon",
    "You're Dead|animation.humanoid.customm.muerto",
    "I'm Here|animation.humanoid.aquiestoy",
    "...|animation.humanoid.naca",
    "Arigato|animation.humanoid.arigato",
    "Lie Down|animation.humanoid.customm.baile_16",
    "Sitting|animation.humanoid.customm.baile_17",
    "Take the L|animation.humanoid.customm.baile_18",
    "Best Mates|animation.humanoid.customm.baile_19",
    "Idle|animation.humanoid.customm.baile_20",
    "Flow|animation.humanoid.customm.baile_21",
    "Skibidi|animation.humanoid.customm.baile_22",
    "Clubbing|animation.humanoid.customm.baile_23",
    "Squat|animation.humanoid.customm.baile_24",
    "Hype|animation.humanoid.customm.baile_25",
  ];

  emotes.forEach((emote) => {
    const [name] = emote.split("|");
    form.button(name);
  });

  const response = await form.show(player);
  if (!response.canceled) {
    if (response.selection === 0) {
      await player.runCommandAsync("playanimation @p animation.creaking.sway");
    } else if (response.selection > 0) {
      const [, command] = emotes[response.selection - 1].split("|");
      await player.runCommandAsync(`playanimation @p ${command} ${command}`);
    }
  }
}

function handleChatCommands(event) {
  const { sender: player, message } = event;
  const cmd = message.trim().toLowerCase();
  event.cancel = true;

  switch (cmd) {
    case "admin":
      if (player.hasTag("Admin")) system.runTimeout(() => showTeamMenu(player), 35);
      break;
    case "world":
      if (player.hasTag("Admin")) system.runTimeout(() => admin_(player), 35);
      break;
    case "list":
      sendPlayerList();
      break;
    case "kill":
      player.runCommandAsync("/playsound random.chestopen @s");
      sendKillList();
      break;
    case "help":
      player.sendMessage(
        "\n§7------ HELP ------\n" +
          "§7[§a!§7] §7help §7- §fShow help menu\n" +
          "§7[§c!§7] §7list §7- §fShow player lists\n" +
          "§7[§c!§7] §7kill §7- §fShow kill lists\n" +
          "§7[§c!§7] §7tp §7- §fTeleport to player\n" +
          "§7[§c!§7] §7admin §7- §fAdmin menu"
      );
      break;
  }
}

function compass(event) {
  const { source: player, itemStack: item } = event;
  if (item.typeId === "minecraft:compass" && (!player.hasTag("uhc") || player.hasTag("Admin"))) {
    showTeamMenu(player);
  }
}

world.afterEvents.itemUse.subscribe(compass);
world.beforeEvents.chatSend.subscribe(handleChatCommands);
