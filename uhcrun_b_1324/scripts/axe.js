import * as mc from "@minecraft/server";

class BlockProcessor {
  static bt = {
    log: new Set([
      "minecraft:acacia_log",
      "minecraft:birch_log",
      "minecraft:cherry_log",
      "minecraft:dark_oak_log",
      "minecraft:jungle_log",
      "minecraft:mangrove_log",
      "minecraft:oak_log",
      "minecraft:spruce_log",
      "minecraft:crimson_stem",
      "minecraft:warped_stem",
      "minecraft:pale_oak_log",
    ]),
    leaf: new Set([
      "minecraft:acacia_leaves",
      "minecraft:birch_leaves",
      "minecraft:cherry_leaves",
      "minecraft:dark_oak_leaves",
      "minecraft:jungle_leaves",
      "minecraft:mangrove_leaves",
      "minecraft:oak_leaves",
      "minecraft:spruce_leaves",
    ]),
  };

  static tools = new Set([
    "minecraft:wooden_axe",
    "minecraft:stone_axe",
    "minecraft:iron_axe",
    "minecraft:golden_axe",
    "minecraft:diamond_axe",
  ]);

  static dirs = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ];

  static MD = 8;
  static BS = 6;
  static MX = 6;
  static activeTasks = new Map();

  static dropItems(block, player) {
    if (!block) return;

    const id = block.typeId;
    let itemType = null;
    let amount = 1;

    if (BlockProcessor.bt.log.has(id)) {
      itemType = id;
      amount = Math.floor(Math.random() * 2) + 1;
    } else if (BlockProcessor.bt.leaf.has(id) && Math.random() < 0.03) {
      itemType = "minecraft:apple";
      player.playSound("random.levelup", { volume: 0.5, pitch: 1.5 });
    }

    if (itemType) {
      const itemStack = new mc.ItemStack(itemType, amount);
      block.dimension?.spawnItem(itemStack, block.location);
    }
  }

  static dist(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) + Math.abs(pos1.z - pos2.z);
  }

  static procQueue(block, visited, queue, depth, maxDepth, player, startBlock) {
    let processed = 0;

    while (queue.length > 0 && processed < BlockProcessor.BS) {
      const { block: curBlock, depth: curDepth } = queue.shift();
      if (!curBlock || curDepth > maxDepth) continue;

      const currentBlock = curBlock.dimension.getBlock(curBlock.location);
      if (!currentBlock) continue;

      const distance = BlockProcessor.dist(startBlock.location, curBlock.location);
      if (distance > BlockProcessor.MX) continue;

      BlockProcessor.dropItems(curBlock, player);
      curBlock.setType("minecraft:air");

      for (const { x, y, z } of BlockProcessor.dirs) {
        const adjLoc = {
          x: curBlock.location.x + x,
          y: curBlock.location.y + y,
          z: curBlock.location.z + z,
        };
        const adj = curBlock.dimension.getBlock(adjLoc);

        if (!adj) continue;

        const key = `${adj.location.x},${adj.location.y},${adj.location.z}`;
        if (
          (BlockProcessor.bt.log.has(adj.typeId) || BlockProcessor.bt.leaf.has(adj.typeId)) &&
          !visited.has(key) &&
          adj.typeId !== "minecraft:air"
        ) {
          visited.set(key, true);
          queue.push({ block: adj, depth: curDepth + 1 });
        }
      }
      processed++;
    }

    if (queue.length > 0) {
      mc.system.run(() => {
        BlockProcessor.procQueue(block, visited, queue, depth + 1, maxDepth, player, startBlock);
      });
    } else {
      BlockProcessor.activeTasks.delete(player.id);
    }
  }
}

function processBlockBreak(event) {
  const { player, block } = event;

  if (!block.dimension.getBlock(block.location)) return;

  const inv = player.getComponent(mc.EntityInventoryComponent.componentId);
  if (!inv?.container) return;

  const item = inv.container.getItem(player.selectedSlotIndex);
  if (!item?.typeId) return;

  const isValidTool = BlockProcessor.tools.has(item.typeId);
  const isValidBlock =
    BlockProcessor.bt.log.has(block.typeId) || BlockProcessor.bt.leaf.has(block.typeId);

  if (!isValidTool || !isValidBlock) return;

  if (BlockProcessor.activeTasks.has(player.id)) {
    player.sendMessage("§cPlease wait for current task to complete!");
    return;
  }

  BlockProcessor.activeTasks.set(player.id, true);
  const visited = new Map();
  const blockKey = `${block.location.x},${block.location.y},${block.location.z}`;
  visited.set(blockKey, true);
  const queue = [{ block, depth: 0 }];

  mc.system.run(() => {
    try {
      BlockProcessor.procQueue(block, visited, queue, 0, BlockProcessor.MD, player, block);
    } catch (error) {
      BlockProcessor.activeTasks.delete(player.id);
    }
  });
}

mc.world.beforeEvents.playerBreakBlock.subscribe(processBlockBreak);
