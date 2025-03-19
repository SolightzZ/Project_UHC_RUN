import { world } from "@minecraft/server";

function play(e, p) {
  try {
    const sfx = ["mob.shulker.shoot", "firework.blast", "firework.large_blast", "firework.twinkle"];
    if (!p?.location) throw new Error("No valid player location");
    e.dimension.playSound(sfx[~~(Math.random() * sfx.length)], p.location);
  } catch (error) {
    console.warn(`play Error: ${error.message}`);
  }
}

function kb(p, dir, x, z) {
  try {
    if (!p || !dir || typeof dir.x !== "number" || typeof dir.z !== "number") {
      throw new Error("Invalid player or direction");
    }
    p.applyKnockback(dir.x, dir.z, x, z);
  } catch (error) {
    console.warn(`kb Error: ${error.message}`);
  }
}

function hit(e) {
  try {
    const p = e.hurtEntity;
    const a = e.damageSource.damagingEntity;

    if (
      p?.typeId === "minecraft:player" &&
      a?.typeId === "minecraft:player" &&
      typeof a.getViewDirection === "function"
    ) {
      const dir = a.getViewDirection();
      kb(p, dir, 0.76, 0.42);
    }
  } catch (error) {
    console.warn(`hit Error: ${error.message}`);
  }
}

function press(e) {
  try {
    if (e.block.typeId !== "minecraft:crimson_pressure_plate") return;

    const p = e.dimension.getEntities({
      location: e.block.location,
      maxDistance: 2,
      type: "minecraft:player",
    })[0];

    if (p && typeof p.getViewDirection === "function") {
      const dir = p.getViewDirection();
      kb(p, dir, 3, 1.5);
      play(e, p);
    }
  } catch (error) {
    console.warn(`press Error: ${error.message}`);
  }
}

world.afterEvents.entityHurt.subscribe(hit);
world.afterEvents.pressurePlatePush.subscribe(press);
