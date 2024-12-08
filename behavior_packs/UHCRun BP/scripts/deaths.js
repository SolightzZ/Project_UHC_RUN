import * as server from "@minecraft/server";

function getScore(player, objective) {
  const obj = server.world.scoreboard.getObjective(objective);
  return obj ? obj.getScore(player.scoreboardIdentity) : 0;
}

function setScore(player, objective, value) {
  const obj = server.world.scoreboard.getObjective(objective);
  if (obj) {
    obj.setScore(player.scoreboardIdentity, value);
  }
}

server.world.afterEvents.entityDie.subscribe((event) => {
  const player = event.deadEntity;

  if (player && player.typeId === "minecraft:player") {
    const currentDeaths = getScore(player, "deaths");

    setScore(player, "deaths", currentDeaths + 1);
    player.runCommand("function sets/sets");
  }
});
