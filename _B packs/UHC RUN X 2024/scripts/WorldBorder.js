import { world, system } from "@minecraft/server";

const countdownTimes = [60, 10, 5, 4, 3, 2, 1];
let Border = false;
let elapsedTicks = 0;
let BORDER_RADIUS = 500;
let BORDER_END = 11;
let timeToShrink = 800;

function getDistanceToBorder(player) {
  const { x, z } = player.location;
  return Math.max(Math.abs(x), Math.abs(z));
}

async function teleportBackToBorder(player, radius) {
  const { x, z } = player.location;
  const newX = x > 0 ? radius - 1.5 : -(radius - 1.5);
  const newZ = z > 0 ? radius - 1.5 : -(radius - 1.5);

  if (Math.abs(x) > radius) {
    await player.runCommandAsync(`tp @s ${newX} ~ ${z}`);
  } else if (Math.abs(z) > radius) {
    await player.runCommandAsync(`tp @s ${x} ~ ${newZ}`);
  }
}

async function showBorderBlocks(player, borderRadius, blockHeight = 1) {
  const blockType = "minecraft:bedrock";
  const yLevel1 = Math.floor(player.location.y);
  const yLevel2 = yLevel1 + blockHeight - 0;

  const distance = getDistanceToBorder(player);

  if (distance > borderRadius - 8 && distance <= borderRadius) {
    const overworld = world.getDimension("minecraft:overworld");
    const nether = world.getDimension("minecraft:nether");

    if (Math.abs(player.location.x) > Math.abs(player.location.z)) {
      const xCoord = player.location.x > -5 ? borderRadius : -borderRadius;
      await overworld.runCommandAsync(
        `fill ${xCoord} ${yLevel1} ${
          Math.floor(player.location.z) - 5
        } ${xCoord} ${yLevel2} ${
          Math.floor(player.location.z) + 5
        } ${blockType}`
      );
      await nether.runCommandAsync(
        `fill ${xCoord} ${yLevel1} ${
          Math.floor(player.location.z) - 5
        } ${xCoord} ${yLevel2} ${
          Math.floor(player.location.z) + 5
        } ${blockType}`
      );
    } else {
      const zCoord = player.location.z > 0 ? borderRadius : -borderRadius;
      await overworld.runCommandAsync(
        `fill ${Math.floor(player.location.x) - 5} ${yLevel1} ${zCoord} ${
          Math.floor(player.location.x) + 5
        } ${yLevel2} ${zCoord} ${blockType}`
      );
      await nether.runCommandAsync(
        `fill ${Math.floor(player.location.x) - 5} ${yLevel1} ${zCoord} ${
          Math.floor(player.location.x) + 5
        } ${yLevel2} ${zCoord} ${blockType}`
      );
    }
  }
}

async function BorderTick(player) {
  await player.runCommandAsync(
    `scoreboard players set "Border" uhc ${Math.floor(BORDER_RADIUS)}`
  );
  await player.runCommandAsync(
    `scoreboard players set "tick" uhc ${elapsedTicks}`
  );
}

system.runInterval(async () => {
  if (!Border) return;

  elapsedTicks++;

  if (elapsedTicks >= 200) {
    const shrinkRate = (BORDER_RADIUS - BORDER_END) / timeToShrink;
    BORDER_RADIUS = Math.max(BORDER_END, BORDER_RADIUS - shrinkRate);
  }
  const players = world.getPlayers();

  countdownTimes.forEach(async (time) => {
    if (elapsedTicks === 200 - time) {
      players.forEach(async (player) => {
        await player.runCommandAsync(
          `/title @s title §fWorld Border in ${time}`
        );
        await player.runCommandAsync("playsound note.bit @a");
        await player.runCommandAsync(
          `tellraw @s {"rawtext":[{"text":"[!] §fWorld Border §cActive in ${time}"}]}`
        );
      });
    }
  });

  if (elapsedTicks === 195) {
    players.forEach(async (player) => {
      await player.runCommandAsync("playsound world @a");
    });
  }

  if (elapsedTicks === 200) {
    players.forEach(async (player) => {
      await player.runCommandAsync("/title @s title §fWorld Border §aActive!");
      await player.runCommandAsync(
        `tellraw @s {"rawtext":[{"text":"[!] §fWorld Border §aActive!"}]}`
      );
    });
  }

  const playersUhc = world
    .getPlayers()
    .filter((player) => player.hasTag("uhc"));
  for (const player of playersUhc) {
    await BorderTick(player);
    const distance = getDistanceToBorder(player);
    const dimension = player.dimension.id;
    const borderRadius =
      dimension === "minecraft:overworld" ? BORDER_RADIUS : BORDER_RADIUS / 8;
    const blockHeight = 8;

    if (distance > borderRadius) {
      await player.runCommandAsync("playsound note.bassattack @s");
      await player.runCommandAsync("title @s title §c⚠");
      await player.runCommandAsync(
        `/titleraw @s subtitle {"rawtext":[{"text":"§cBorder❗${Math.floor(
          BORDER_RADIUS
        )}"}]}`
      );
      await teleportBackToBorder(player, borderRadius);
    } else if (distance > borderRadius - 7) {
      await showBorderBlocks(player, borderRadius, blockHeight);
    }
  }
}, 20);

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;
  if (event.id === "B:e") {
    Border = true;
    elapsedTicks = 0;
    player.sendMessage(" [!] Border enabled!");
  } else if (event.id === "B:d") {
    Border = false;
    player.sendMessage(" [!] Border disabled!");
  }
});
