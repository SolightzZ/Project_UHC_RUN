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

async function menu(p) {
  const form = new ActionFormData()
    .title("§g§r")
    .body("§7Sleeplite Event UHC§6Run§7 2025 \nx WFD & Titan Town")
    .button("SPAWN", "textures/items/dragons_breath");

  TEAMS.forEach((t) => form.button(`${t.color}${t.name} Team`, t.icon));
  form.button("Emotes", "textures/ui/sidebar_icons/emotes.png");
  if (p.hasTag("Admin")) form.button("Show Menu", "textures/ui/sidebar_icons/csb_sidebar_icon");

  const res = await form.show(p);
  if (res && !res.canceled) await pick(p, res.selection);
}

async function pick(p, sel) {
  if (sel === 0) return spawn(p);
  if (sel <= TEAMS.length) return team(p, TEAMS[sel - 1]);
  if (sel === TEAMS.length + 1) return emotes(p);
  if (sel === TEAMS.length + 2 && p.hasTag("Admin")) return adminMenu(p);
}

async function team(p, t) {
  if (!p.hasTag(t.id)) {
    world.sendMessage(dynamicToast(`${t.color}${t.name} Team §7- ${p.name}`, t.icon));
  }
  await p.runCommandAsync(`function team/addteam_${t.id.slice(-1)}`);
}

async function spawn(p) {
  await p.runCommandAsync("spreadplayers 596 622 0 1 @s");
  await p.playSound("random.enderchestopen", { volume: 0.9, pitch: 0.95 });
  const { x, y, z } = p.location;
  await p.dimension.spawnParticle("so:light2", { x, y: y + 5, z });
}

async function adminMenu(p) {
  const form = new ActionFormData()
    .title("Show Menu")
    .button("Player list", "textures/ui/sidebar_icons/genre")
    .button("Kill list", "textures/ui/sidebar_icons/character_creator")
    .button("Compass", "textures/items/compass_item")
    .button("Spawn", "textures/ui/sidebar_icons/dressing_room_customization")
    .button("@a", "textures/ui/sidebar_icons/dressing_room_skins");
  const res = await form.show(p);
  if (res && !res.canceled) await adminPick(p, res.selection);
}

async function adminPick(p, sel) {
  const acts = [
    () => list(),
    () => kills(),
    () => p.runCommandAsync("function sets/compass"),
    () => p.runCommandAsync("spreadplayers 596 622 0 1 @a"),
    () => tpAll(p),
  ];
  if (sel < acts.length) await acts[sel]();
}

async function admin(p) {
  const form = new ActionFormData();
  form.title("Admin Menu");
  form.button("§9Reset Team", "textures/ui/sidebar_icons/my_characters");
  form.button("§cGame End [!]", "textures/ui/sidebar_icons/capes");
  form.button("§bSetup [!]", "textures/ui/sidebar_icons/addon");
  form.button("§qGame Start", "textures/ui/sidebar_icons/realms");
  const res = await form.show(p);
  if (res && !res.canceled) await adminAct(p, res.selection);
}

async function adminAct(p, sel) {
  const acts = [
    () => p.runCommandAsync("function team/clearAll"),
    () => p.runCommandAsync("function games/end"),
    () => p.runCommandAsync("function setup"),
    () => p.runCommandAsync("function games/start"),
  ];
  if (sel < acts.length) await acts[sel]();
}

async function tpAll(p) {
  const { location } = p;
  for (const t of world.getAllPlayers()) {
    t.teleport(location, {
      rotation: { x: 0, y: p.getRotation()?.y ?? 0 },
      keepVelocity: false,
    });
  }
}

async function list() {
  let msg = "§8----- §gUHCRun Team §8-----§f\n";
  for (const t of TEAMS) {
    const ps = [...world.getPlayers({ tags: [t.id] })];
    if (ps.length > 0) {
      msg += `${t.color}${t.name} ${ps.length}: ${ps.map((p) => p.name).join(", ")}\n`;
    }
  }
  world.sendMessage(msg);
}

async function kills() {
  const sb = world.scoreboard;
  let k = sb.getObjective("kills") || sb.addObjective("kills", "Kills");
  let msg = "§8----- §gUHCRun Kills §8-----§f\n";
  for (const p of world.getPlayers()) {
    const score = k.getScore(p) ?? 0;
    msg += ` §7§l\u00BB §r§f${p.name} §c${score} kill\n`;
  }
  world.sendMessage(msg);
}

async function emotes(p) {
  const form = new ActionFormData()
    .title("§g§rEmotes")
    .button("Clear Emote", "textures/ui/csbChevronArrowLarge");

  const list = [
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

  list.forEach((e) => {
    const [name] = e.split("|");
    form.button(name);
  });

  const res = await form.show(p);
  if (!res.canceled) {
    if (res.selection === 0) {
      await p.runCommandAsync("playanimation @p animation.creaking.sway");
    } else if (res.selection > 0) {
      const [, cmd] = list[res.selection - 1].split("|");
      await p.runCommandAsync(`playanimation @p ${cmd} ${cmd}`);
    }
  }
}

function chat(e) {
  const { sender: p, message } = e;
  const cmd = message.trim().toLowerCase();
  e.cancel = true;

  switch (cmd) {
    case "admin":
      if (p.hasTag("Admin")) system.runTimeout(() => menu(p), 35);
      break;
    case "world":
      if (p.hasTag("Admin")) system.runTimeout(() => admin(p), 35);
      break;
    case "list":
      list();
      break;
    case "kill":
      p.runCommandAsync("/playsound random.chestopen @s");
      kills();
      break;
    case "help":
      p.sendMessage(
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

function use(e) {
  const { source: p, itemStack: item } = e;
  if (item.typeId === "minecraft:compass" && (!p.hasTag("uhc") || p.hasTag("Admin"))) {
    menu(p);
  }
}

world.afterEvents.itemUse.subscribe(use);
world.beforeEvents.chatSend.subscribe(chat);
