import { world, system } from "@minecraft/server";

class Hook {
  static proj = new Set(["minecraft:fishing_hook"]);
  static kb = 1.5;
  static dmg = 0.5;

  static hit(arg) {
    const targ = arg.getEntityHit()?.entity;
    const { proj, src } = arg;

    if (
      !targ ||
      !src ||
      targ.typeId !== "minecraft:player" ||
      src.typeId !== "minecraft:player" ||
      !proj ||
      !this.proj.has(proj.typeId) ||
      targ.id === src.id
    ) {
      return;
    }

    const dir = src.getViewDirection();

    targ.applyDamage(this.dmg);

    const force = this.kb + Math.random() * 0.5;
    targ.applyKnockback(dir.x, dir.z, force, 0.5);

    src.playSound("minecraft:item.fishing_rod.cast", { volume: 0.8, pitch: 1.0 });

    system.runTimeout(() => {
      if (proj.isValid()) {
        proj.remove();
      }
    }, 0.95);
  }
}

world.afterEvents.projectileHitEntity.subscribe(Hook.hit.bind(Hook));
