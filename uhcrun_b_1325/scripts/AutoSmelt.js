import { world, ItemStack } from "@minecraft/server";

const Smelt = {
  blocks: new Set([
    "minecraft:iron_ore",
    "minecraft:deepslate_iron_ore",
    "minecraft:gold_ore",
    "minecraft:deepslate_gold_ore",
    "minecraft:coal_ore",
  ]),

  items: new Set(["minecraft:raw_iron", "minecraft:raw_gold"]),

  types: {
    diamond: new Set([
      "minecraft:diamond_ore",
      "minecraft:deepslate_diamond_ore",
      "minecraft:obsidian",
    ]),
    lapis: new Set(["minecraft:lapis_ore", "minecraft:deepslate_lapis_ore"]),
    oreGravel: new Set([
      "minecraft:deepslate_coal_ore",
      "minecraft:deepslate_emerald_ore",
      "minecraft:gravel",
      "minecraft:coal_ore",
      "minecraft:emerald_ore",
    ]),
    ids: new Set(["minecraft:coal", "minecraft:emerald"]),
  },

  typeCache: new Set(),

  smelt(item) {
    try {
      if (!item || !item.typeId) throw new Error("Invalid item or typeId");
      if (!this.items.has(item.typeId)) return null;

      let outType;
      if (item.typeId === "minecraft:raw_iron") outType = "minecraft:iron_ingot";
      else if (item.typeId === "minecraft:raw_gold") outType = "minecraft:gold_ingot";
      return outType ? new ItemStack(outType, item.amount) : null;
    } catch (error) {
      console.warn(`Smelt Error: ${error.message}`);
      return null;
    }
  },

  procSmelt(b, p, perm) {
    if (!this.blocks.has(perm.type.id)) return;
    try {
      const ents = p.dimension.getEntities({
        location: b.location,
        maxDistance: 2,
        type: "minecraft:item",
        maxCount: 10,
      });
      if (ents.length === 0) return;
      ents.forEach((e) => {
        if (!e.hasComponent("minecraft:item")) return;
        const comp = e.getComponent("minecraft:item");
        const item = comp.itemStack;
        const out = this.smelt(item);
        if (out) {
          e.dimension.spawnItem(out, e.location);
          p.addExperience(~~(Math.random() * 4) + 1);
          p.playSound("random.orb", { volume: 0.2, pitch: 1.5 });
          e.kill();
        }
      });
    } catch (error) {
      console.warn(`procSmelt Error: ${error.message}`);
    }
  },

  procOre(b, p, perm) {
    if (!this.types.oreGravel.has(perm.type.id)) return;
    try {
      const ents = p.dimension.getEntities({
        location: b.location,
        maxDistance: 2,
        type: "minecraft:item",
        maxCount: 10,
      });
      if (ents.length === 0) return;
      ents.forEach((e) => {
        if (!e.hasComponent("minecraft:item")) return;
        const comp = e.getComponent("minecraft:item");
        const item = comp.itemStack;
        if (item.typeId === "minecraft:flint") {
          const arrow = new ItemStack("minecraft:arrow", item.amount);
          p.dimension.spawnItem(arrow, e.location);
          p.playSound("random.orb", { volume: 0.2, pitch: 1.5 });
          e.kill();
        } else if (this.types.ids.has(item.typeId)) {
          p.playSound("random.orb", { volume: 0.2, pitch: 1.5 });
          this.giveXp(p, item);
          e.kill();
        }
      });
    } catch (error) {
      console.warn(`procOre Error: ${error.message}`);
    }
  },

  giveXp(p, item) {
    let xp = 0;
    if (item.typeId === "minecraft:coal") xp = ~~(Math.random() * 10) + 1;
    else if (item.typeId === "minecraft:emerald") xp = ~~(Math.random() * 15) + 1;
    if (xp > 0) p.addExperience(xp);
  },

  proc(e) {
    const { player, block, brokenBlockPermutation } = e;
    const id = brokenBlockPermutation.type.id;

    if (!this.typeCache.has(id)) {
      let matched = false;
      for (const key of Object.keys(this.types)) {
        if (this.types[key].has(id)) {
          this.typeCache.add(id);
          if (key === "diamond") this.diamond(player);
          else if (key === "lapis") this.book(player, Math.random());
          else if (key === "oreGravel") this.procOre(block, player, brokenBlockPermutation);
          matched = true;
          break;
        }
      }
      if (!matched && id === "fake:redstone_ores") this.redstone(player);
    } else {
      if (this.types.diamond.has(id)) this.diamond(player);
      else if (this.types.lapis.has(id)) this.book(player, Math.random());
      else if (this.types.oreGravel.has(id)) this.procOre(block, player, brokenBlockPermutation);
      else if (id === "fake:redstone_ores") this.redstone(player);
    }
  },

  diamond(p) {
    p.playSound("random.orb", { volume: 0.2, pitch: 1.5 });
  },

  book(p, chance) {
    if (chance < 0.2) {
      this.drop(p, "minecraft:book");
      p.playSound("random.levelup", { volume: 0.2, pitch: 1.5 });
      p.onScreenDisplay.setActionBar("");
    }
  },

  drop(p, item) {
    try {
      const stack = new ItemStack(item, 1);
      p.dimension.spawnItem(stack, p.location);
    } catch (error) {
      console.warn(`Drop Error: ${error.message}`);
    }
  },

  redstone(p) {
    p.addExperience(~~(Math.random() * 4) + 1);
    p.playSound("random.orb", { volume: 0.4, pitch: 1.5 });
    if (Math.random() < 0.25) {
      p.addEffect("absorption", 600, { showParticles: false, amplifier: 0 });
      p.playSound("random.levelup", { volume: 0.8, pitch: 1.5 });
      p.onScreenDisplay.setActionBar("");
    }
  },
};

Smelt.keys = Smelt.blocks;

function breakBlock(e) {
  const { player, block, brokenBlockPermutation } = e;
  try {
    Smelt.proc(e);
    if (Smelt.keys.has(brokenBlockPermutation.type.id)) {
      Smelt.procSmelt(block, player, brokenBlockPermutation);
    }
  } catch (error) {
    console.warn(`breakBlock Error: ${error.message}`);
  }
}

world.afterEvents.playerBreakBlock.subscribe(breakBlock);
