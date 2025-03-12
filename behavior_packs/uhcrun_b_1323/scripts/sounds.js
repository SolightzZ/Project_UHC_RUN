import { world, system } from "@minecraft/server";

class ProjectileHandler {
  static Projectiles = new Set([
    "minecraft:arrow",
    "minecraft:thrown_trident",
    "minecraft:snowball",
  ]);

  static handleProjectileHitEntity(arg) {
    const hitEntity = arg.getEntityHit()?.entity;
    const { projectile, source } = arg;

    if (
      !hitEntity ||
      hitEntity.typeId !== "minecraft:player" ||
      !source ||
      source.typeId !== "minecraft:player" ||
      !ProjectileHandler.Projectiles.has(projectile.typeId) ||
      hitEntity.id === source.id
    ) {
      return;
    }
    source.runCommand("playsound random.orb @s ~~~ 0.5 1");
  }
}

class TNTHandler {
  static handleTNTPlace(event) {
    const { block } = event;
    const { x, y, z } = block.location;

    if (block.typeId === "minecraft:tnt") {
      system.run(() => {
        block.setType("minecraft:air");
        world.getDimension(block.dimension.id).spawnEntity("minecraft:tnt", {
          x: x + 0.5,
          y: y + 0.4,
          z: z + 0.5,
        });
      });
    }
  }
}

world.afterEvents.projectileHitEntity.subscribe(ProjectileHandler.handleProjectileHitEntity);
world.afterEvents.playerPlaceBlock.subscribe(TNTHandler.handleTNTPlace);
