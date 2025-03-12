import { world, system, ItemStack } from "@minecraft/server";

const AutoSmelt = {
  smeltableBlocks: new Set([
    "minecraft:iron_ore",
    "minecraft:deepslate_iron_ore",
    "minecraft:gold_ore",
    "minecraft:deepslate_gold_ore",
    "minecraft:coal_ore",
  ]),

  smeltableItems: new Map([
    ["minecraft:raw_iron", "minecraft:iron_ingot"],
    ["minecraft:raw_gold", "minecraft:gold_ingot"],
  ]),

  blockTypes: {
    diamondOre: new Set([
      "minecraft:diamond_ore",
      "minecraft:deepslate_diamond_ore",
      "minecraft:obsidian",
    ]),
    lapisOre: new Set(["minecraft:lapis_ore", "minecraft:deepslate_lapis_ore"]),
    oreOrGravel: new Set([
      "minecraft:deepslate_coal_ore",
      "minecraft:deepslate_emerald_ore",
      "minecraft:gravel",
      "minecraft:coal_ore",
      "minecraft:emerald_ore",
    ]),
    itemIds: new Set(["minecraft:coal", "minecraft:emerald"]),
  },

  processSmeltableItem(itemStack) {
    const processedItem = this.smeltableItems.get(itemStack.typeId);
    return processedItem ? new ItemStack(processedItem, itemStack.amount) : null;
  },

  handleAutoSmelt(block, player, brokenBlockPermutation) {
    if (this.smeltableBlocks.has(brokenBlockPermutation.type.id)) {
      const nearbyEntities = player.dimension.getEntities({
        location: block.location,
        maxDistance: 2,
        type: "minecraft:item",
      });

      nearbyEntities.forEach((entity) => {
        if (entity.hasComponent("minecraft:item")) {
          const itemComponent = entity.getComponent("minecraft:item");
          const itemStack = itemComponent.itemStack;
          const processedItem = this.processSmeltableItem(itemStack);

          if (processedItem) {
            entity.dimension.spawnItem(processedItem, entity.location);
            player.addExperience(Math.floor(Math.random() * 4) + 1);
            player.playSound("random.orb", { volume: 0.2, pitch: 1.5 });
            entity.kill();
          }
        }
      });
    }
  },

  handleOreOrGravel(block, player, brokenBlockPermutation) {
    if (this.blockTypes.oreOrGravel.has(brokenBlockPermutation.type.id)) {
      const nearbyEntities = player.dimension.getEntities({
        location: block.location,
        maxDistance: 2,
        type: "minecraft:item",
      });

      nearbyEntities.forEach((entity) => {
        if (entity.hasComponent("minecraft:item")) {
          const itemComponent = entity.getComponent("minecraft:item");
          const itemStack = itemComponent.itemStack;

          if (itemStack.typeId === "minecraft:flint") {
            const arrow = new ItemStack("minecraft:arrow", itemStack.amount);
            player.dimension.spawnItem(arrow, entity.location);
            player.playSound("random.orb", { volume: 0.2, pitch: 1.5 });
            entity.kill();
          } else if (this.blockTypes.itemIds.has(itemStack.typeId)) {
            player.playSound("random.orb", { volume: 0.2, pitch: 1.5 });
            this.awardExperience(player, itemStack);
            entity.kill();
          }
        }
      });
    }
  },

  awardExperience(player, itemStack) {
    let xpAmount = 0;
    if (itemStack.typeId === "minecraft:coal") {
      xpAmount = Math.floor(Math.random() * 10) + 1;
    } else if (itemStack.typeId === "minecraft:emerald") {
      xpAmount = Math.floor(Math.random() * 15) + 1;
    }
    if (xpAmount > 0) player.addExperience(xpAmount);
  },

  handleBlockInteractions(event) {
    const { player, block, brokenBlockPermutation } = event;
    const blockId = brokenBlockPermutation.type.id;

    for (const key of Object.keys(this.blockTypes)) {
      const blockSet = this.blockTypes[key];
      if (blockSet.has(blockId)) {
        if (key === "diamondOre") {
          this.checkDiamondDrop(player);
        } else if (key === "lapisOre") {
          this.checkBookDrop(player, Math.random());
        } else if (key === "oreOrGravel") {
          this.handleOreOrGravel(block, player, brokenBlockPermutation);
        }
      }
      if (blockId === "fake:redstone_ores") {
        this.handleRedstoneOres(player);
      }
    }
  },

  checkDiamondDrop(player) {
    player.playSound("random.orb", { volume: 0.2, pitch: 1.5 });
  },

  checkBookDrop(player, chance) {
    if (chance < 0.2) {
      this.spawnItem(player, "minecraft:book");
      player.onScreenDisplay.setActionBar("§6Book dropped!");
      player.playSound("random.levelup", { volume: 0.2, pitch: 1.5 });
    }
  },

  spawnItem(player, itemName) {
    const itemStack = new ItemStack(itemName, 1);
    player.dimension.spawnItem(itemStack, player.location);
  },

  handleRedstoneOres(player) {
    player.addExperience(Math.floor(Math.random() * 4) + 1);
    player.playSound("random.orb", { volume: 0.4, pitch: 1.5 });

    if (Math.random() < 0.25) {
      player.addEffect("absorption", 600, { showParticles: false, amplifier: 0 });
      player.playSound("random.levelup", { volume: 0.8, pitch: 1.5 });
    }
  },
};

function handleBlockBreak(event) {
  const { player, block, brokenBlockPermutation } = event;

  AutoSmelt.handleBlockInteractions(event);

  if (AutoSmelt.smeltableBlocks.has(brokenBlockPermutation.type.id)) {
    AutoSmelt.handleAutoSmelt(block, player, brokenBlockPermutation);
  }
}

world.afterEvents.playerBreakBlock.subscribe(handleBlockBreak);
