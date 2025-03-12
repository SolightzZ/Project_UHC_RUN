import { world, system } from "@minecraft/server";

class FishingHookHandler {
  static VALID_PROJECTILES = new Set(["minecraft:fishing_hook"]);
  static KNOCKBACK_STRENGTH = 1.5;
  static DAMAGE = 0.5;

  static onProjectileHit(arg) {
    const hit = arg.getEntityHit()?.entity;
    const { projectile, source } = arg;

    if (
      !hit ||
      !source ||
      hit.typeId !== "minecraft:player" ||
      source.typeId !== "minecraft:player" ||
      !projectile ||
      !this.VALID_PROJECTILES.has(projectile.typeId) ||
      hit.id === source.id
    ) {
      return;
    }

    const direction = source.getViewDirection();

    hit.applyDamage(this.DAMAGE);

    const strength = this.KNOCKBACK_STRENGTH + Math.random() * 0.5;
    hit.applyKnockback(direction.x, direction.z, strength, 0.5);

    source.playSound("minecraft:item.fishing_rod.cast", { volume: 0.8, pitch: 1.0 });

    system.runTimeout(() => {
      if (projectile.isValid()) {
        projectile.remove();
      }
    }, 0.95);
  }
}

world.afterEvents.projectileHitEntity.subscribe(
  FishingHookHandler.onProjectileHit.bind(FishingHookHandler)
);
