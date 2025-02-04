import { world } from "@minecraft/server";

const AllowedProjectiles = ["minecraft:arrow", "minecraft:thrown_trident"];

world.afterEvents.projectileHitEntity.subscribe((arg) => {
  const hitEntity = arg.getEntityHit()?.entity;

  const { projectile, source } = arg;

  if (
    hitEntity?.typeId != "minecraft:player" ||
    source?.typeId != "minecraft:player" ||
    !AllowedProjectiles.includes(projectile.typeId) ||
    hitEntity.id === source.id
  ) {
    return;
  }
  source.runCommand("playsound random.orb @a[r=8] ~~1~");
});
