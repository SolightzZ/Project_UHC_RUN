import { world, system, GameMode } from "@minecraft/server";
import { dynamicToast } from "./message";

let uhcOn = false;

function wait(ms) {
  return new Promise((resolve) => {
    const id = system.runTimeout(() => {
      system.clearRun(id);
      resolve();
    }, ms / 20);
  });
}

async function setup(p) {
  await wait(150);
  await greet(p);
  await boost(p);
  await equip(p);

  if (uhcOn && !p.hasTag("uhc")) {
    await spec(p);
  }
}

async function greet(p) {
  world.sendMessage(
    dynamicToast(`Welcome to the \n§7${p.name}`, "", "textures/ui/beacon_button_locked")
  );
}

async function boost(p) {
  await p.runCommandAsync("playsound spawn @a[r=8] ~ ~ ~ 10 1.1 10");
  await p.runCommandAsync("particle so:light2 ~~4.5~");
  await p.runCommandAsync("hud @s hide item_text");
  await p.runCommandAsync("hud @s hide status_effects");
  await p.runCommandAsync("function sets/name");
}

async function equip(p) {
  await p.runCommandAsync(`loot replace entity @a slot.hotbar 8 loot "solight/compass"`);
}

async function spec(p) {
  p.setGameMode(GameMode.spectator);
  await p.sendMessage(
    " §7§l\u00BB§r§7 คุณได้เข้าร่วมในฐานะผู้ชม สามารถพิมพ์ `§btp§7` ไปหาผู้เล่นที่อยู่ใน UHC ได้เลย"
  );
  await p.addTag("gamemode");
}

world.afterEvents.playerSpawn.subscribe(async ({ player, initialSpawn }) => {
  if (!initialSpawn) return;
  await setup(player);
});

system.afterEvents.scriptEventReceive.subscribe((e) => {
  if (!e.sourceEntity) return;

  switch (e.id) {
    case "join:start":
      uhcOn = true;
      world.sendMessage(" [!] โหมดป้องกันผู้เล่นเข้ามา §aเปิดใช้งานแล้ว");
      break;
    case "join:stop":
      uhcOn = false;
      world.sendMessage(" [!] โหมดป้องกันผู้เล่นเข้ามา §cปิดใช้งานแล้ว");
      break;
    default:
      break;
  }
});
