import { world, EquipmentSlot, ItemComponentTypes, EnchantmentType } from "@minecraft/server";
import { dynamicToast } from "./message";

class UHCGame {
  static btSapling = new Set([
    "minecraft:oak_sapling",
    "minecraft:spruce_sapling",
    "minecraft:birch_sapling",
    "minecraft:jungle_sapling",
    "minecraft:acacia_sapling",
    "minecraft:dark_oak_sapling",
    "minecraft:cherry_sapling",
    "minecraft:mangrove_propagule",
    "minecraft:raw_copper",
    "minecraft:wheat_seeds",
    "minecraft:pumpkin_seeds",
    "minecraft:melon_seeds",
    "minecraft:torchflower_seeds",
    "minecraft:big_dripleaf",
    "minecraft:bamboo",
    "minecraft:sweet_berries",
    "minecraft:kelp",
    "minecraft:rabbit_foot",
    "minecraft:azalea",
    "minecraft:flowering_azalea",
    "minecraft:beetroot_seeds",
    "minecraft:pale_oak_sapling",
    "minecraft:pink_petals",
    "minecraft:sugar_cane",
    "minecraft:seagrass",
  ]);

  static enchantItems = new Set([
    "minecraft:wooden_pickaxe",
    "minecraft:wooden_shovel",
    "minecraft:stone_shovel",
    "minecraft:stone_pickaxe",
    "minecraft:iron_shovel",
    "minecraft:iron_pickaxe",
    "minecraft:golden_shovel",
    "minecraft:golden_pickaxe",
    "minecraft:diamond_shovel",
    "minecraft:diamond_pickaxe",
  ]);

  static handleEntitySpawn(event) {
    const entity = event.entity;
    if (entity.typeId !== "minecraft:item" || !entity.hasComponent("minecraft:item")) return;

    const itemComp = entity.getComponent("minecraft:item");
    const itemStack = itemComp?.itemStack;
    if (!itemStack) return;

    if (itemStack.typeId === "minecraft:hopper_minecart") {
      this.notifyNearbyPlayers(entity);
      entity.kill();
    } else if (this.btSapling.has(itemStack.typeId)) {
      entity.kill();
    }
  }

  static notifyNearbyPlayers(entity) {
    const entityLocation = entity.location;
    world.getPlayers().forEach((player) => {
      const playerLocation = player.location;
      const distance = Math.hypot(
        playerLocation.x - entityLocation.x,
        playerLocation.y - entityLocation.y,
        playerLocation.z - entityLocation.z
      );
      if (distance <= 16) {
        player.playSound("mob.vex.charge", { volume: 2, pitch: 0.85 });
        player.playSound("firework.twinkle", { volume: 0.5, pitch: 1 });
        player.spawnParticle("fireworksrocket", entity.location);
      }
    });
  }

  static handlePlayerBreakBlock(event) {
    const { player } = event;
    const equippable = player.getComponent("minecraft:equippable");
    const mainhandItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
    if (!mainhandItem || !this.enchantItems.has(mainhandItem.typeId)) return;
    const enchantable = mainhandItem.getComponent(ItemComponentTypes.Enchantable);
    if (!enchantable || enchantable.getEnchantment("minecraft:efficiency")) return;
    enchantable.addEnchantment({
      type: new EnchantmentType("minecraft:efficiency"),
      level: 4,
    });
    equippable.setEquipment(EquipmentSlot.Mainhand, mainhandItem);
    const itemName =
      mainhandItem.nameTag ||
      mainhandItem.typeId
        .replace("minecraft:", "")
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    world.sendMessage(dynamicToast(`${itemName} §bEfficiency IV`));
    player.playSound("block.enchanting_table.use", { volume: 1, pitch: 1 });
  }
}
world.afterEvents.entitySpawn.subscribe(UHCGame.handleEntitySpawn.bind(UHCGame));
world.afterEvents.playerBreakBlock.subscribe(UHCGame.handlePlayerBreakBlock.bind(UHCGame));
