import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

async function colorTeam0(player) {
  const f = new ui.ActionFormData();
  f.title("");
  f.button("§cRed Team");
  f.button("§9Blue Team");
  f.button("§gYellow Team");
  f.button("§aGreen Team");
  f.button("§dPurple Team");
  f.button("§bAqua Team");
  f.button("§6Orange Team");
  f.button("Gray Team");
  if (player.hasTag("Admin")) {
    f.button(" + Setting + ");
  }

  const response = await f.show(player);
  if (response && !response.canceled) {
    switch (response.selection) {
      case 8:
        if (player.hasTag("Admin")) {
          await showGameMenu(player);
        }
        break;

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
    }
  } else {
    await player.runCommandAsync("playsound note.bassattack");
  }
}

async function showGameMenu(player) {
  const form = new ui.ActionFormData();
  form.title("Game Menu");
  form.button("Setup");
  form.button("Compass");
  form.button("Game Start");
  form.button("Winner");
  form.button("Game Ending");
  form.button("Reset Team");

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
        await player.runCommandAsync("particle rainbowswirl");
        break;
    }
  } else {
    await player.runCommandAsync("playsound note.bassattack");
  }
}

mc.world.afterEvents.itemUse.subscribe((data) => {
  const player = data.source;
  const item = data.itemStack;

  if (item.typeId === "minecraft:compass") {
    if (!player.hasTag("uhc") || player.hasTag("Admin")) {
      colorTeam0(player);
    }
  }
});
