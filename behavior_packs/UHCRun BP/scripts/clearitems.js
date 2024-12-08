import { world, system } from "@minecraft/server";

const saplingItems = [
  "minecraft:furnace",
  "minecraft:grindstone",
  "minecraft:oak_sapling",
  "minecraft:spruce_sapling",
  "minecraft:birch_sapling",
  "minecraft:jungle_sapling",
  "minecraft:acacia_sapling",
  "minecraft:dark_oak_sapling",
  "minecraft:cherry_sapling",
  "minecraft:mangrove_propagule",
  "minecraft:wheat_seeds",
  "minecraft:emerald",
  "minecraft:coal",
  "minecraft:wheat_seeds",
];

system.runInterval(async () => {
  for (const player of world.getPlayers()) {
    if (!player.hasTag("uhc")) continue;

    const inventory = player.getComponent("inventory").container;

    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);

      if (item && saplingItems.includes(item.typeId)) {
        await player.runCommand(`clear @s ${item.typeId} 0 1`);
      }
    }
  }
}, 20);
