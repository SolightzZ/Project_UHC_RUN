import { world } from "@minecraft/server";

function playRandomSound(event, player) {
  const sounds = [
    "mob.shulker.shoot",
    "firework.blast",
    "firework.large_blast",
    "firework.twinkle",
  ];
  event.dimension.playSound(sounds[Math.floor(Math.random() * sounds.length)], player.location);
}

function _K(player, direction, strengthX, strengthZ) {
  if (player) {
    player.applyKnockback(direction.x, direction.z, strengthX, strengthZ);
  }
}

function _A(data) {
  const player = data.hurtEntity;
  const attacker = data.damageSource.damagingEntity;

  if (player.typeId === "minecraft:player" && attacker && attacker.getViewDirection) {
    const direction = attacker.getViewDirection();
    _K(player, direction, 0.8, 0.4);
  }
}

function _P(event) {
  if (event.block.typeId === "minecraft:crimson_pressure_plate") {
    const player = event.dimension.getEntities({
      location: event.block.location,
      maxDistance: 2,
      type: "minecraft:player",
    })[0];

    if (player) {
      const direction = player.getViewDirection();
      _K(player, direction, 3, 1.5);
      playRandomSound(event, player);
    }
  }
}

world.afterEvents.entityHurt.subscribe(_A);
world.afterEvents.pressurePlatePush.subscribe(_P);
