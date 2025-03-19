import * as mc from "@minecraft/server";

class BlockProc {
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
  static BS = 4;
  static MX = 8;
  static MAX_BLOCKS = 55;
  static activePlayers = new Set();
  static COOLDOWN = 40;

  static drop(block, player) {
    if (!block) return;

    const id = block.typeId;
    let item = null;
    let amt = 1;

    if (BlockProc.bt.log.has(id)) {
      item = id;
      amt = ~~(Math.random() * 2) + 1;
    } else if (BlockProc.bt.leaf.has(id) && Math.random() < 0.035) {
      item = "minecraft:apple";
      player.playSound("random.levelup", { volume: 0.5, pitch: 1.5 });
    }

    if (item) {
      const stack = new mc.ItemStack(item, amt);
      block.dimension?.spawnItem(stack, block.location);
    }
  }

  static dist(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) + Math.abs(p1.z - p2.z);
  }

  static proc(block, seen, queue, depth, max, player, start, blockCount) {
    let done = 0;

    while (queue.length > 0 && done < BlockProc.BS && blockCount < BlockProc.MAX_BLOCKS) {
      const { block: cur, depth: d } = queue.shift();
      if (!cur || d > max) continue;

      const curr = cur.dimension.getBlock(cur.location);
      if (!curr) continue;

      if (BlockProc.dist(start.location, cur.location) > BlockProc.MX) continue;

      BlockProc.drop(cur, player);
      cur.setType("minecraft:air");
      blockCount++;

      for (const { x, y, z } of BlockProc.dirs) {
        const pos = {
          x: cur.location.x + x,
          y: cur.location.y + y,
          z: cur.location.z + z,
        };
        const adj = cur.dimension.getBlock(pos);

        if (!adj) continue;

        const key = `${adj.location.x},${adj.location.y},${adj.location.z}`;
        if (
          (BlockProc.bt.log.has(adj.typeId) || BlockProc.bt.leaf.has(adj.typeId)) &&
          !seen.has(key) &&
          adj.typeId !== "minecraft:air"
        ) {
          seen.add(key);
          queue.push({ block: adj, depth: d + 1 });
        }
      }
      done++;
    }

    if (queue.length > 0 && blockCount < BlockProc.MAX_BLOCKS) {
      mc.system.run(() => {
        BlockProc.proc(block, seen, queue, depth + 1, max, player, start, blockCount);
      });
    } else if (blockCount >= BlockProc.MAX_BLOCKS) {
      BlockProc.activePlayers.delete(player.id);
    } else {
      BlockProc.activePlayers.delete(player.id);
    }
  }
}

function breakBlock(event) {
  const { player, block } = event;

  if (!block.dimension.getBlock(block.location)) return;
  if (BlockProc.activePlayers.has(player.id)) return;

  const inv = player.getComponent(mc.EntityInventoryComponent.componentId);
  if (!inv?.container) return;

  const item = inv.container.getItem(player.selectedSlotIndex);
  if (!item?.typeId) return;

  if (
    !BlockProc.tools.has(item.typeId) ||
    (!BlockProc.bt.log.has(block.typeId) && !BlockProc.bt.leaf.has(block.typeId))
  )
    return;

  BlockProc.activePlayers.add(player.id);
  const seen = new Set();
  const key = `${block.location.x},${block.location.y},${block.location.z}`;
  seen.add(key);
  const queue = [{ block, depth: 0 }];

  mc.system.run(() => {
    try {
      BlockProc.proc(block, seen, queue, 0, BlockProc.MD, player, block, 0);
    } catch (e) {
      player.sendMessage(`§cเกิดข้อผิดพลาด: ${e.message}`);
      BlockProc.activePlayers.delete(player.id);
    }
  });

  mc.system.runTimeout(() => {
    BlockProc.activePlayers.delete(player.id);
  }, BlockProc.COOLDOWN);
}

mc.world.beforeEvents.playerBreakBlock.subscribe(breakBlock);
