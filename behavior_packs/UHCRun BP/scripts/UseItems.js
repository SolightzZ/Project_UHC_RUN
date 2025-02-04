import { world, system, ItemStack, ItemTypes } from "@minecraft/server";

const enchantItems = [
  "minecraft:wooden_axe",
  "minecraft:wooden_pickaxe",
  "minecraft:wooden_shovel",
  "minecraft:stone_shovel",
  "minecraft:stone_pickaxe",
  "minecraft:stone_axe",
  "minecraft:iron_shovel",
  "minecraft:iron_pickaxe",
  "minecraft:iron_axe",
  "minecraft:golden_shovel",
  "minecraft:golden_pickaxe",
  "minecraft:golden_axe",
  "minecraft:diamond_axe",
  "minecraft:diamond_shovel",
  "minecraft:diamond_pickaxe",
];

const hoeItems = [
  "minecraft:wooden_hoe",
  "minecraft:stone_hoe",
  "minecraft:iron_hoe",
  "minecraft:golden_hoe",
  "minecraft:diamond_hoe",
];

world.afterEvents.itemUse.subscribe(async (event) => {
  const player = event.source;
  const item = event.itemStack;

  if (item && item.typeId) {
    if (enchantItems.includes(item.typeId)) {
      await applyEnchantments(player, item, ["efficiency 4"]);
    }
    if (hoeItems.includes(item.typeId)) {
      await applyEnchantments(player, item, ["efficiency 3", "fortune 3"]);
    }
  }
});

async function applyEnchantments(player, item, enchantments) {
  for (const enchant of enchantments) {
    player.runCommandAsync(`enchant @s ${enchant}`);
  }
}
