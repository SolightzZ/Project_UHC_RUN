import { world, system, GameMode } from "@minecraft/server";
import { dynamicToast } from "./message";

let UHC_Enabled = false;

function delay(ms) {
  return new Promise((resolve) => {
    const timeoutID = system.runTimeout(() => {
      system.clearRun(timeoutID);
      resolve();
    }, ms / 20);
  });
}

async function setupPlayerForJoin(player) {
  await delay(150);
  await showWelcomeMessage(player);
  await applyPlayerEffects(player);
  await giveInitialLoot(player);

  if (UHC_Enabled && !player.hasTag("uhc")) {
    await setSpectatorMode(player);
  }
}

async function showWelcomeMessage(player) {
  world.sendMessage(
    dynamicToast(`Welcome to the \n§7${player.name}`, "", "textures/ui/beacon_button_locked")
  );
}

async function applyPlayerEffects(player) {
  await player.runCommandAsync("playsound spawn @a[r=8] ~ ~ ~ 10 1.1 10");
  await player.runCommandAsync("particle so:light2 ~~4.5~");
  await player.runCommandAsync("hud @s hide item_text");
  await player.runCommandAsync("hud @s hide status_effects");
  await player.runCommandAsync("function sets/name");
}

async function giveInitialLoot(player) {
  await player.runCommandAsync(`loot replace entity @a slot.hotbar 8 loot "solight/compass"`);
}

async function setSpectatorMode(player) {
  player.setGameMode(GameMode.spectator);
  await player.sendMessage(
    " > คุณได้เข้าร่วมในฐานะผู้ชม สามารถพิมพ์ tp ไปหาผู้เล่นที่อยู่ใน UHC ได้เลย"
  );
  await player.addTag("gamemode");
}

world.afterEvents.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
  if (!initialSpawn) return;
  await setupPlayerForJoin(player);
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (!event.sourceEntity) return;

  switch (event.id) {
    case "uhc:is_now":
      UHC_Enabled = true;
      world.sendMessage(" [!] โหมดป้องกันผู้เล่นเข้ามา §aเปิดใช้งานแล้ว");
      break;
    case "uhc:is_stop":
      UHC_Enabled = false;
      world.sendMessage(" [!] โหมดป้องกันผู้เล่นเข้ามา §cปิดใช้งานแล้ว");
      break;
    default:
      break;
  }
});
