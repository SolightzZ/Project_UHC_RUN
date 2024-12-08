import { world, system } from "@minecraft/server";

let main0 = false;
let main = 0;

async function updateMainScore(player) {
  await player.runCommandAsync(`scoreboard players set "Main" uhc ${main}`);
  await player.runCommandAsync("spawnpoint @s ~ ~1 ~");
}

system.runInterval(async (tick) => {
  if (!main0) return;

  const players = world.getPlayers();
  const uhcPlayers = players.filter((player) => player.hasTag("uhc"));
  main++;
  //console.warn(`Main: ${main}`);

  await Promise.all(uhcPlayers.map((player) => updateMainScore(player)));

  if (main === 60) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : §cPVP Disabled"}]}`
          );
          await players.runCommandAsync("title @s title §cPVP Disabled");
          await players.runCommandAsync("gamerule pvp false");
          await players.runCommandAsync("playsound beacon.deactivate @a");
          await players.runCommandAsync("function sets/border");
        })
      );
    }
  }

  if (main === 120) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : World Border Active in §c600§f Tick"}]}`
          );
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : §c+ 500 -§f : World Border"}]}`
          );
          await players.runCommandAsync(
            "title @s title §fBorder [ §a+ §f§l500 §r§c- §f]"
          );
          await players.runCommandAsync(
            "execute at @a run playsound beacon.deactivate @a ~ ~ ~ 20 1 10"
          );
        })
      );
    }
  }

  if (main === 200) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync("playsound random.click @a");
          await players.runCommandAsync(
            'tellraw @s {"rawtext":[{"text":"  : §fUHC§6RUN §7Made by "}]}'
          );
          await players.runCommandAsync(
            'tellraw @s {"rawtext":[{"text":"  : Sleeplite Event UHC Run Christmas "}]}'
          );
          await players.runCommandAsync(
            'tellraw @s {"rawtext":[{"text":"  : Sleeplite x WFD"}]}'
          );
          await players.runCommandAsync(
            'tellraw @s {"rawtext":[{"text":"  : Sleeplite x Titan Town "}]}'
          );
        })
      );
    }
  }

  if (main === 885) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync("playsound random.click @a");
          await players.runCommandAsync("title @s title ❗PVP Enabled in §k3");
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : ❗PVP Enabled in §k3"}]}`
          );
        })
      );
    }
  }

  if (main === 891) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync("playsound random.click @a");
          await players.runCommandAsync("title @s title §e§l3");
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : PVP Enabled §e§l3"}]}`
          );
        })
      );
    }
  }

  if (main === 894) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync("playsound random.click @a");
          await players.runCommandAsync("title @s title §6§l2");
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : PVP Enabled §6§l2"}]}`
          );
        })
      );
    }
  }

  if (main === 897) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync("playsound random.click @a");
          await players.runCommandAsync("title @s title §c§l1");
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : PVP Enabled §c§l1"}]}`
          );
        })
      );
    }
  }

  if (main === 900) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync("gamerule pvp true");
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : §aPVP §lEnabled"}]}`
          );
          await players.runCommandAsync("playsound world @a");
          await players.runCommandAsync("title @s title §aPVP Enabled");
        })
      );
    }
  }

  if (main === 1500) {
    if (uhcPlayers.length > 0) {
      await Promise.all(
        uhcPlayers.map(async (players) => {
          await players.runCommandAsync("gamerule mobgriefing false");
          await players.runCommandAsync("gamerule domobspawning false");
          await players.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"  : §cMob Spawn Disabled"}]}`
          );
          await players.runCommandAsync("title @s title §cMob Spawn Disabled");
          await players.runCommandAsync("playsound world @a");
        })
      );
    }
  }
}, 20);

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;
  if (!player) return;

  if (event.id === "main:start") {
    if (main0) {
      player.sendMessage(" [!] Main §cEnable!");
      return;
    }
    main0 = true;
    main = 0;
    player.sendMessage("§a [!] Main Enable!");
  } else if (event.id === "main:stop") {
    if (!main0) {
      player.sendMessage(" [!] Main §cDisable!");
      return;
    }
    main0 = false;
    player.sendMessage("§c [!] Main Disable!");
  }
});
