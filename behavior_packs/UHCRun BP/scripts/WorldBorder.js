import { world, system } from "@minecraft/server";

const countdownTimes = [90, 10, 5, 4, 3, 2, 1];
let Border = true;
let tickss = 0;
let BORDER_RADIUS = 500;
let BORDER_END = 2;
let timeToShrink = 900;

function getDistanceToBorder(player) {
  const { x, z } = player.location;
  return Math.max(Math.abs(x), Math.abs(z));
}

async function teleportBackToBorder(player, radius, buffer = 3) {
  const { x, z } = player.location;
  const maxX = radius - buffer;
  const maxZ = radius - buffer;

  if (Math.abs(x) > radius) {
    await player.runCommandAsync(`tp @s ${x > 0 ? maxX : -maxX} ~ ${z}`);
  } else if (Math.abs(z) > radius) {
    await player.runCommandAsync(`tp @s ${x} ~ ${z > 0 ? maxZ : -maxZ}`);
  }
}

async function showBorderBlocks(player, borderRadius, blockHeight = 1) {
  const blockType = "minecraft:bedrock";
  const yLevel1 = Math.floor(player.location.y - 3);
  const yLevel2 = yLevel1 + blockHeight - 1;

  // คำนวณระยะห่างถึงเขตแดน
  const distance = getDistanceToBorder(player);

  // ตรวจสอบว่าผู้เล่นอยู่ในระยะใกล้กับเขตแดน
  if (distance > borderRadius - 11 && distance <= borderRadius) {
    if (Math.abs(player.location.x) > Math.abs(player.location.z)) {
      // สร้างเขตแดนทางแนวแกน X
      const xCoord = player.location.x > 0 ? borderRadius : -borderRadius;

      await player.runCommandAsync(
        `fill ${xCoord} ${yLevel1} ${
          Math.floor(player.location.z) - 16
        } ${xCoord} ${yLevel2} ${
          Math.floor(player.location.z) + 16
        } ${blockType}`
      );
    } else {
      // สร้างเขตแดนทางแนวแกน Z
      const zCoord = player.location.z > 0 ? borderRadius : -borderRadius;

      await player.runCommandAsync(
        `fill ${Math.floor(player.location.x) - 16} ${yLevel1} ${zCoord} ${
          Math.floor(player.location.x) + 16
        } ${yLevel2} ${zCoord} ${blockType}`
      );
    }
  }
}

async function BorderTick(player) {
  await Promise.all([
    player.runCommandAsync(
      `scoreboard players set "Border" uhc ${Math.floor(BORDER_RADIUS)}`
    ),
    player.runCommandAsync(`scoreboard players set "tick" uhc ${tickss}`),
  ]);
}

async function showWarning(player, borderRadius) {
  player.runCommandAsync("playsound mob.wither.break_block @s");
  player.runCommandAsync("title @s title §c⚠");
  player.runCommandAsync(
    `/titleraw @s subtitle {"rawtext":[{"text":"Border§c❗${Math.floor(
      borderRadius
    )}"}]}`
  );
}

system.runInterval(async () => {
  if (!Border) return;
  const players = world.getPlayers();
  const playersUhc = players.filter((player) => player.hasTag("uhc"));
  const shrinkRate = (BORDER_RADIUS - BORDER_END) / timeToShrink;

  tickss++;

  if (tickss >= 600) {
    BORDER_RADIUS = Math.max(BORDER_END, BORDER_RADIUS - shrinkRate);
  }

  countdownTimes.forEach(async (time) => {
    if (tickss === 600 - time) {
      if (playersUhc.length > 0) {
        for (const player of playersUhc) {
          await player.runCommandAsync(`title @s title §c${time}`);
          await player.runCommandAsync("playsound note.hat @s");
          await player.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : §fWorld Border ❗§cActive in ${time}"}]}`
          );
        }
      }
    }
  });

  if (tickss === 600) {
    if (playersUhc.length > 0) {
      await Promise.all(
        playersUhc.map(async (player) => {
          await player.runCommandAsync("playsound world @a");
          await player.runCommandAsync("/title @s title §fBorder §aActive!");
          await player.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : §fWorld Border §aActive!"}]}`
          );
        })
      );
    }
  }

  for (const player of playersUhc) {
    await BorderTick(player);
    const borderRadius = BORDER_RADIUS;
    const distance = getDistanceToBorder(player);

    if (distance > borderRadius) {
      await Promise.all([
        showWarning(player, borderRadius),
        teleportBackToBorder(player, borderRadius),
        showBorderBlocks(player, borderRadius, 11),
      ]);
    } else if (distance > borderRadius - 11) {
      showBorderBlocks(player, borderRadius, 11);
    }
  }
}, 20);

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;
  if (event.id === "B:e") {
    if (Border) {
      player.sendMessage(" [!]");
      return;
    }
    Border = true;
    tickss = 0;
    player.sendMessage(" [!] Border §aEnable!");
  } else if (event.id === "B:d") {
    if (!Border) {
      player.sendMessage(" §6[!!] Border  §cDisable!");
      return;
    }
    Border = false;
    player.sendMessage(" [!] Border §cDisable!");
  }
});
