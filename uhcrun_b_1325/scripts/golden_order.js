import { world } from "@minecraft/server";

const blocks = new Set([
  "minecraft:cartography_table",
  "minecraft:brewing_stand",
  "minecraft:furnace",
  "minecraft:blast_furnace",
  "minecraft:grindstone",
  "minecraft:smithing_table",
  "minecraft:ender_chest",
  "minecraft:shulker_box",
  "minecraft:hopper",
  "minecraft:flower_pot",
  "minecraft:smoker",
  "minecraft:respawn_anchor",
  "minecraft:barrel",
  "minecraft:composter",
  "minecraft:room",
]);

const doors = [
  "ender_chest",
  "wheat",
  "gate",
  "trapdoor",
  "crafter",
  "anvil",
  "crafting_table",
  "candle",
  "spruce_hanging_sign",
  "minecraft:decorated_pot",
];

const sfx = ["mob.shulker.shoot", "firework.blast", "firework.large_blast", "firework.twinkle"];

function checkDoor(type, p) {
  const isDoor = doors.some((key) => type.includes(key));
  return isDoor && !p.hasTag("uhc");
}

function checkBlock(type) {
  return blocks.has(type);
}

function blockUse(e) {
  const { block, player } = e;

  if (!block || !block.isValid()) {
    return;
  }

  const type = block.typeId;

  if (type === "minecraft:ender_chest") {
    e.cancel = true;
    Promise.resolve().then(() => {
      const dir = player.getViewDirection();
      player.applyKnockback(dir.x, dir.z, -2, 0.5);
      player.playSound(sfx[~~(Math.random() * sfx.length)], player.location);
    });
    return;
  }

  if (checkBlock(type) || checkDoor(type, player)) {
    e.cancel = true;
    Promise.resolve().then(() => player.playSound("note.bass", { volume: 1, pitch: 1 }));
  }
}

world.beforeEvents.playerInteractWithBlock.subscribe(blockUse);
