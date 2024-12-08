import * as server from "@minecraft/server";

function trackAttack(attacker, victim) {
  const attackerTagPrefix = "attackedBy:";

  victim
    .getTags()
    .filter((tag) => tag.startsWith(attackerTagPrefix))
    .forEach((tag) => victim.removeTag(tag));

  victim.addTag(`${attackerTagPrefix}${attacker.name}`);
}

server.world.afterEvents.entityHurt.subscribe((event) => {
  const attacker = event.damageSource.damagingEntity;
  const victim = event.hurtEntity;

  if (
    attacker?.typeId === "minecraft:player" &&
    victim?.typeId === "minecraft:player"
  ) {
    trackAttack(attacker, victim);
  }
});

server.world.afterEvents.entityDie.subscribe((event) => {
  const victim = event.deadEntity;

  if (victim?.typeId === "minecraft:player") {
    const attackerTag = victim
      .getTags()
      .find((tag) => tag.startsWith("attackedBy:"));

    if (attackerTag) {
      const attackerName = attackerTag.split(":")[1];
      const attacker = server.world
        .getPlayers()
        .find((player) => player.name === attackerName);

      if (attacker) {
        const killsObjective = server.world.scoreboard.getObjective("kills");
        if (killsObjective) {
          const attackerScore = killsObjective.getScore(
            attacker.scoreboardIdentity
          );
          killsObjective.setScore(
            attacker.scoreboardIdentity,
            attackerScore + 1
          );
        }
      }
    }

    victim
      .getTags()
      .filter((tag) => tag.startsWith("attackedBy:"))
      .forEach((tag) => victim.removeTag(tag));
  }
});
