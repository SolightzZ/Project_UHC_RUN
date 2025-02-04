import { system, world } from "@minecraft/server";

const playerStates = new Map();
let isActionBarActive = true;

function showActionBar() {
  const players = world.getPlayers();
  players.forEach((player) => {
    if (isActionBarActive) {
      let actionBarText = [];

      actionBarText.push(
        { text: "" },
        { text: "\n \n : Red §a" },
        { score: { name: "total", objective: "team1" } },
        { text: "\n§r : Blue §a" },
        { score: { name: "total", objective: "team2" } },
        { text: "\n§r : Yellow §a" },
        { score: { name: "total", objective: "team3" } },
        { text: "\n§r : Green §a" },
        { score: { name: "total", objective: "team4" } },
        { text: "\n§r : Purple §a" },
        { score: { name: "total", objective: "team5" } },
        { text: "\n§r : Aqua §a" },
        { score: { name: "total", objective: "team6" } },
        { text: "\n§r : Orange §a" },
        { score: { name: "total", objective: "team7" } },
        { text: "\n§r : Gray §a" },
        { score: { name: "total", objective: "team8" } },
        { text: "\n§r : Pink §a" },
        { score: { name: "total", objective: "team9" } },
        { text: "§r\n \n§7Kill: §a" },
        { score: { name: player.name, objective: "kills" } },
        { text: "§7\nTicks: §a" },
        { score: { name: "tick", objective: "uhc" } },
        { text: "§7\nBorder: §a" },
        { score: { name: "Border", objective: "uhc" } },
        { text: "§7\n \nSleeplite.net: §a" }
      );

      player.runCommandAsync(
        `titleraw @s actionbar ${JSON.stringify({ rawtext: actionBarText })}`
      );
    }
  });
}

function start(player) {
  if (playerStates.get(player.id)) return;
  playerStates.set(player.id, true);

  system.runInterval(async () => {
    if (!playerStates.get(player.id)) return;
    await player.runCommandAsync(`spawnpoint @a[tag=uhc] ~ ~ ~2`);
  }, 150);
}

function stop(player) {
  if (!playerStates.get(player.id)) return;
  playerStates.set(player.id, false);
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;

  if (player && player.typeId === "minecraft:player") {
    if (event.id === "display:start") {
      start(player);
      player.sendMessage(" [!] Display enabled!");
    } else if (event.id === "display:stop") {
      stop(player);
      player.sendMessage(" [!] Display Disabled!");
    }
  }
});
