import { world, system, ItemStack, ItemTypes } from "@minecraft/server";

async function replaceRawWithIngot(player, type, inventory) {
  await player.runCommandAsync(`clear @s minecraft:raw_${type} 0 1`);
  const newItem = new ItemStack(ItemTypes.get(`minecraft:${type}_ingot`), 1);

  await Promise.all([
    inventory.addItem(newItem),
    player.runCommandAsync("xp 4"),
  ]);
}

system.runInterval(async () => {
  for (const player of world.getPlayers()) {
    if (!player.hasTag("uhc")) continue;

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

    if (emptySlots > 0 && (hasRawIron || hasRawGold)) {
      if (hasRawIron) await replaceRawWithIngot(player, "iron", inventory);
      else if (hasRawGold) await replaceRawWithIngot(player, "gold", inventory);
    }
  }
}, 10);
