import { world, system, ItemStack, ItemTypes } from "@minecraft/server";

const saplingItems = [
  "minecraft:oak_sapling",
  "minecraft:spruce_sapling",
  "minecraft:birch_sapling",
  "minecraft:jungle_sapling",
  "minecraft:acacia_sapling",
  "minecraft:dark_oak_sapling",
  "minecraft:cherry_sapling",
  "minecraft:mangrove_propagule",
  "minecraft:wheat_seeds",
];

async function clearItems(player, itemsToClear) {
  for (const item of itemsToClear)
    await player.runCommandAsync(`clear @s ${item}`);
}

async function replaceRawWithIngot(player, type) {
  await player.runCommandAsync(`clear @s minecraft:raw_${type} 0 1`);
  const newItem = new ItemStack(ItemTypes.get(`minecraft:${type}_ingot`), 1);
  player.getComponent("inventory").container.addItem(newItem);
  await player.runCommandAsync("playsound random.orb @s ~ ~ ~ 0.05");
  await player.runCommandAsync("playsound block.furnace.lit");
  await player.runCommandAsync("xp 4");
}

system.runInterval(async () => {
  for (const player of world.getPlayers()) {
    if (!player.hasTag("uhc")) continue;

    await clearItems(player, saplingItems);

    const inventory = player.getComponent("inventory").container;
    let hasRawIron = false;
    let hasRawGold = false;
    let emptySlots = 0;

    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (item) {
        if (item.typeId === "minecraft:raw_iron") hasRawIron = true;
        if (item.typeId === "minecraft:raw_gold") hasRawGold = true;
      } else {
        emptySlots++;
      }
    }

    if (hasRawIron && emptySlots > 0) {
      await replaceRawWithIngot(player, "iron");
    } else if (hasRawGold && emptySlots > 0) {
      await replaceRawWithIngot(player, "gold");
    }
  }
}, 20);
