import { world } from "@minecraft/server";

const block1 = new Set([
  "minecraft:oak_leaves",
  "minecraft:spruce_leaves",
  "minecraft:birch_leaves",
  "minecraft:jungle_leaves",
  "minecraft:acacia_leaves",
  "minecraft:dark_oak_leaves",
  "minecraft:mangrove_leaves",
  "minecraft:cherry_leaves",
]);

world.afterEvents.playerBreakBlock.subscribe((event) => {
  const player = event.player;
  const permutation = event.brokenBlockPermutation;

  if (!player || !permutation) return;
  if (!player.hasTag("uhc")) return;

  const blockName = permutation.type.id;
  const randomChance = Math.random();
  if (
    blockName === "minecraft:lapis_ore" ||
    blockName === "minecraft:deepslate_lapis_ore"
  ) {
    if (randomChance < 0.1) {
      player.runCommandAsync("give @s obsidian 1");
      player.runCommandAsync("title @s actionbar  +1     ");
      player.runCommandAsync(
        "playsound lodestone_compass.link_compass_to_lodestone"
      );
    } else if (randomChance < 0.2) {
      player.runCommandAsync("give @s book 1");
      player.runCommandAsync("title @s actionbar  +1     ");
      player.runCommandAsync("playsound item.book.page_turn");
    }
  }

  if (block1.has(blockName) && randomChance < 0.02) {
    player.runCommandAsync("give @s apple 1");
    player.runCommandAsync("title @s actionbar  +1     ");
    player.runCommandAsync("playsound random.levelup @s ~ ~ ~ 0.5");
  }

  if (blockName === "minecraft:gravel" && randomChance < 0.3) {
    player.runCommandAsync("give @s arrow 1");
    player.runCommandAsync("title @s actionbar  +1     ");
    player.runCommandAsync("playsound crossbow.loading.start");
  }
});
