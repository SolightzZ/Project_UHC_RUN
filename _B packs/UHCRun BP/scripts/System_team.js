import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

async function colorTeam0(player) {
  const f = new ui.ActionFormData();
  f.title("§g§r");
  f.body("§7Christmas x UHCRUN : Sleeplite Server");
  f.button("§cRed Team", "textures/items/dye_powder_red");
  f.button("§9Blue Team", "textures/items/dye_powder_blue_new");
  f.button("§gYellow Team", "textures/items/dye_powder_yellow");
  f.button("§aGreen Team", "textures/items/dye_powder_lime");
  f.button("§5Purple Team", "textures/items/dye_powder_purple");
  f.button("§bAqua Team", "textures/items/dye_powder_light_blue");
  f.button("§6Orange Team", "textures/items/dye_powder_orange");
  f.button("Gray Team", "textures/items/dye_powder_silver");
  f.button("§dPikn Team", "textures/items/dye_powder_pink");
  f.button("§lHUB SPAWN§r\n§7Teleport", "textures/items/door_wood");
  if (player.hasTag("Emote")) f.button("Emote", "textures/items/light_block_5");
  if (player.hasTag("Admin")) f.button(" Setting ", "textures/blocks/barrier");

  const response = await f.show(player);
  if (response && !response.canceled) {
    switch (response.selection) {
      case 0:
        await player.runCommandAsync("function team/addteam_1");
        await player.runCommandAsync("particle rainbowswirl");
        break;

      case 1:
        await player.runCommandAsync("function team/addteam_2");
        await player.runCommandAsync("particle rainbowswirl");
        break;

      case 2:
        await player.runCommandAsync("function team/addteam_3");
        await player.runCommandAsync("particle rainbowswirl");
        break;

      case 3:
        await player.runCommandAsync("function team/addteam_4");
        await player.runCommandAsync("particle rainbowswirl");
        break;

      case 4:
        await player.runCommandAsync("function team/addteam_5");
        await player.runCommandAsync("particle rainbowswirl");
        break;

      case 5:
        await player.runCommandAsync("function team/addteam_6");
        await player.runCommandAsync("particle rainbowswirl");
        break;

      case 6: // Orange Team
        await player.runCommandAsync("function team/addteam_7");
        await player.runCommandAsync("particle rainbowswirl");
        break;

      case 7: // Gray Team
        await player.runCommandAsync("function team/addteam_8");
        await player.runCommandAsync("particle rainbowswirl");
        break;
      case 8: //
        await player.runCommandAsync("function team/addteam_9");
        await player.runCommandAsync("particle rainbowswirl");
        break;
      case 9:
        await player.runCommandAsync("spreadplayers 600 600 0 8 @s");
        await player.runCommandAsync(
          "execute as @p at @s run particle so:light2 ~~0.1~"
        );
        await player.runCommandAsync("playsound random.enderchestopen @s");
        break;
      case 10:
        if (player.hasTag("Emote") && response.selection === 10) {
          await showEmote(player);
        }
        break;
      case 11:
        if (player.hasTag("Emote") && response.selection === 11) {
          await showGameMenu(player);
        }
        break;
      default:
        break;
    }
  } else {
    await player.runCommandAsync("playsound note.bassattack");
  }
}

async function showGameMenu(player) {
  const form = new ui.ActionFormData();
  form.title("§g§rSetting Menu");
  form.body("§7Setting for Admin");
  form.button("Setup", "textures/items/minecart_command_block");
  form.button("Compass", "textures/items/compass_item");
  form.button("Game Start", "textures/items/apple_golden");
  form.button("Winner", "textures/items/totem");
  form.button("Game Ending", "textures/items/recovery_compass_item");
  form.button("Reset Team", "textures/items/bone");
  form.button("TP", "textures/items/book_portfolio");
  form.button("Spawns", "textures/items/book_writable");

  const response = await form.show(player);
  if (response && !response.canceled) {
    switch (response.selection) {
      case 0:
        await player.runCommandAsync("function uhc/setup");
        break;
      case 1:
        await player.runCommandAsync("function sets/compass");
        break;
      case 2:
        await player.runCommandAsync("function games/start");
        break;
      case 3:
        await player.runCommandAsync("function rank/win");
        break;
      case 4:
        await player.runCommandAsync("function games/end");
        break;
      case 5:
        await player.runCommandAsync("function team/clearAll");
        break;
      case 6:
        await player.runCommandAsync("tp @a @s");
        break;
      case 7:
        await player.runCommandAsync("spreadplayers 600 600 0 8 @a");
        break;
      default:
        break;
    }
  } else {
    await player.runCommandAsync("playsound note.bassattack");
  }
}

async function showEmote(player) {
  const form = new ui.ActionFormData();
  form.title("§g§rEmotes");
  form.body("§7กดใช้ Emote ในเกมส์ เพื่อล้าง Emote Addons");
  const emotes = [
    { name: "Dab", command: "animation.humanoid.custom.dab" },
    { name: "Twerking", command: "animation.humanoid.custom.perreo" },
    { name: "LMAO", command: "animation.humanoid.custom.risa" },
    { name: "Cry", command: "animation.humanoid.custom.llorar" },
    { name: "Desperate", command: "animation.humanoid.desesperado" },
    { name: "T - Pose", command: "animation.humanoid.t-pose" },
    { name: "Slap", command: "animation.humanoid.customm.cachetada" },
    { name: "Flip", command: "animation.humanoid.flip_atras" },
    { name: "Throwing Money", command: "animation.humanoid.melapelas" },
    { name: "Floss", command: "animation.humanoid.baile" },
    { name: "Champion", command: "animation.humanoid.customm.campeon" },
    { name: "You're Dead", command: "animation.humanoid.customm.muerto" },
    { name: "I'm Here", command: "animation.humanoid.aquiestoy" },
    { name: "...", command: "animation.humanoid.naca" },
    { name: "Arigato", command: "animation.humanoid.arigato" },
    { name: "Lie Down", command: "animation.humanoid.customm.baile_16" },
    { name: "Sitting", command: "animation.humanoid.customm.baile_17" },
    { name: "Take the L", command: "animation.humanoid.customm.baile_18" },
    { name: "Best Mates", command: "animation.humanoid.customm.baile_19" },
    { name: "Idle", command: "animation.humanoid.customm.baile_20" },
    { name: "Flow", command: "animation.humanoid.customm.baile_21" },
    { name: "Skibidi", command: "animation.humanoid.customm.baile_22" },
    { name: "Clubbing", command: "animation.humanoid.customm.baile_23" },
    { name: "Squat", command: "animation.humanoid.customm.baile_24" },
    { name: "Hype", command: "animation.humanoid.customm.baile_25" },
  ];

  emotes.forEach((emote) => form.button(emote.name));

  form.show(player).then(async (response) => {
    if (response.canceled) return;
    const selectedEmote = emotes[response.selection];
    if (selectedEmote) {
      await player.runCommandAsync(
        `playanimation @s ${selectedEmote.command} ${selectedEmote.command}`
      );
    }
  });
}

mc.world.afterEvents.itemUse.subscribe((data) => {
  const player = data.source;
  const item = data.itemStack;

  try {
    if (item.typeId === "minecraft:compass") {
      if (!player.hasTag("uhc") || player.hasTag("Admin")) {
        colorTeam0(player);
      }
    }
  } catch (error) {
    console.error("Error in itemUse event:", error);
  }
});
