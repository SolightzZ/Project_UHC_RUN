import { world, system } from "@minecraft/server";
import { dynamicToast } from "./message";
import { UHCGame } from "./uhc/main.js";

const attackTracker = new Map();
const deathLocations = new Map();

const isValidUhcPlayer = (entity) => entity?.typeId === "minecraft:player" && entity.hasTag("uhc");

function recordAttack(attacker, victim) {
  if (!attacker || !victim || attacker.id === victim.id) return;
  attackTracker.set(victim.id, attacker);
}

function incrementScore(player, objectiveId, displayName = objectiveId) {
  let objective =
    world.scoreboard.getObjective(objectiveId) ||
    world.scoreboard.addObjective(objectiveId, displayName);
  objective.addScore(player.scoreboardIdentity, 1);
}

function processPlayerDeath(deadPlayer, killer) {
  if (!deadPlayer) return;

  const playerName = deadPlayer.nameTag;
  const { x, y, z } = deadPlayer.location || {};

  if (isValidUhcPlayer(deadPlayer) && x !== undefined && y !== undefined && z !== undefined) {
    deathLocations.set(playerName, { x, y, z });
    deadPlayer.runCommandAsync("function sets/sets");
  }

  if (killer && isValidUhcPlayer(killer)) {
    incrementScore(killer, "kills");
    world.sendMessage(
      dynamicToast(`${killer.nameTag} killed ${playerName}`, "textures/items/dye_powder_red")
    );
    announceFirstBlood(killer);
  }

  incrementScore(deadPlayer, "deaths");
  attackTracker.delete(deadPlayer.id);
}

function announceFirstBlood(killer) {
  if (!killer) return;

  UHCGame.broadcastMessage(world.getAllPlayers().filter(isValidUhcPlayer), {
    actionBar: "",
    message: `${killer.nameTag} §cFirst kill!`,
    title: "§cFirst Kill!",
    subtitle: `${killer.nameTag}`,
    sound: "mob.wither.spawn",
  });
}

function onEntityHurt(event) {
  const { damageSource, hurtEntity } = event;
  if (!hurtEntity || !damageSource?.damagingEntity) return;

  const attacker = damageSource.damagingEntity;
  if (isValidUhcPlayer(hurtEntity) && isValidUhcPlayer(attacker)) {
    recordAttack(attacker, hurtEntity);
  }
}

function onEntityDie(event) {
  const { deadEntity } = event;
  if (!deadEntity || deadEntity.typeId !== "minecraft:player") return;

  const killer = attackTracker.get(deadEntity.id);
  processPlayerDeath(deadEntity, killer);
}

function onPlayerSpawn(event) {
  const { player } = event;
  const lastLocation = deathLocations.get(player.nameTag);

  if (lastLocation) {
    if (!player) return;
    player.teleport(
      { x: lastLocation.x + 0.5, y: lastLocation.y, z: lastLocation.z + 0.5 },
      { dimension: player.dimension }
    );
    deathLocations.delete(player.nameTag);
  }
}

function onScriptEvent(event) {
  if (event.id !== "kd:clear" || !event.sourceEntity) return;
  if (attackTracker.size > 0) {
    attackTracker.clear();
    console.warn("Cleared attack tracking data.");
  }
}

world.afterEvents.entityHurt.subscribe(onEntityHurt);
world.afterEvents.entityDie.subscribe(onEntityDie);
world.afterEvents.playerSpawn.subscribe(onPlayerSpawn);
system.afterEvents.scriptEventReceive.subscribe(onScriptEvent);
