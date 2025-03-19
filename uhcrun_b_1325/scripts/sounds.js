import { world, system } from "@minecraft/server";

class Proj {
  static types = new Set(["minecraft:arrow", "minecraft:thrown_trident", "minecraft:snowball"]);

  static hit(e) {
    const targ = e.getEntityHit()?.entity;
    const { proj, src } = e;

    if (
      !targ ||
      targ.typeId !== "minecraft:player" ||
      !src ||
      src.typeId !== "minecraft:player" ||
      !Proj.types.has(proj.typeId) ||
      targ.id === src.id
    ) {
      return;
    }
    src.runCommand("playsound random.orb @s ~~~ 0.5 1");
  }
}

class TNT {
  static place(e) {
    const { block } = e;
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

world.afterEvents.projectileHitEntity.subscribe(Proj.hit);
world.afterEvents.playerPlaceBlock.subscribe(TNT.place);
