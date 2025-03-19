import { world, EquipmentSlot, ItemComponentTypes, EnchantmentType } from "@minecraft/server";
import { dynamicToast } from "./message";

class UHC {
  static saplings = new Set([
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

  static tools = new Set([
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

  static spawn(e) {
    const ent = e.entity;
    if (ent.typeId !== "minecraft:item" || !ent.hasComponent("minecraft:item")) return;

    const comp = ent.getComponent("minecraft:item");
    const item = comp?.itemStack;
    if (!item) return;

    if (item.typeId === "minecraft:hopper_minecart") {
      this.alert(ent);
      ent.kill();
    } else if (this.saplings.has(item.typeId)) {
      ent.kill();
    }
  }

  static alert(ent) {
    const loc = ent.location;
    world.getPlayers().forEach((p) => {
      const pLoc = p.location;
      const dist = Math.hypot(pLoc.x - loc.x, pLoc.y - loc.y, pLoc.z - loc.z);
      if (dist <= 16) {
        p.playSound("mob.vex.charge", { volume: 2, pitch: 0.85 });
        p.playSound("firework.twinkle", { volume: 0.5, pitch: 1 });
        p.spawnParticle("fireworksrocket", loc);
      }
    });
  }

  static break(e) {
    const { player } = e;
    const equip = player.getComponent("minecraft:equippable");
    const hand = equip?.getEquipment(EquipmentSlot.Mainhand);
    if (!hand || !this.tools.has(hand.typeId)) return;
    const ench = hand.getComponent(ItemComponentTypes.Enchantable);
    if (!ench || ench.getEnchantment("minecraft:efficiency")) return;
    ench.addEnchantment({
      type: new EnchantmentType("minecraft:efficiency"),
      level: 4,
    });
    equip.setEquipment(EquipmentSlot.Mainhand, hand);
    const name =
      hand.nameTag ||
      hand.typeId
        .replace("minecraft:", "")
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    world.sendMessage(dynamicToast(`${name} §bEfficiency IV\n§7§l\u00BB§r§7 ${player.name}`));
    player.playSound("block.enchanting_table.use", { volume: 1, pitch: 1 });
  }
}

world.afterEvents.entitySpawn.subscribe(UHC.spawn.bind(UHC));
world.afterEvents.playerBreakBlock.subscribe(UHC.break.bind(UHC));
