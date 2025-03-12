import { world } from "@minecraft/server";

const restrictedBlocksSet = new Set([
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

const doorOrGateKeywords = [
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

const sounds = ["mob.shulker.shoot", "firework.blast", "firework.large_blast", "firework.twinkle"];

function isDoorOrGate(blockType, player) {
  const isDoorOrGateBlock = doorOrGateKeywords.some((keyword) => blockType.includes(keyword));
  return isDoorOrGateBlock && !player.hasTag("uhc");
}

function isRestrictedBlock(blockType) {
  return restrictedBlocksSet.has(blockType);
}

function restrictBlockInteraction(eventData) {
  const { block, player } = eventData;

  if (!block || !block.isValid()) {
    return;
  }

  const blockType = block.typeId;

  if (blockType === "minecraft:ender_chest") {
    eventData.cancel = true;
    Promise.resolve().then(() => {
      const direction = player.getViewDirection();
      player.applyKnockback(direction.x, direction.z, -2, 0.5);
      player.playSound(sounds[Math.floor(Math.random() * sounds.length)], player.location);
    });
    return;
  }

  if (isRestrictedBlock(blockType) || isDoorOrGate(blockType, player)) {
    eventData.cancel = true;
    Promise.resolve().then(() => player.playSound("note.bass", { volume: 1, pitch: 1 }));
  }
}

world.beforeEvents.playerInteractWithBlock.subscribe(restrictBlockInteraction);
