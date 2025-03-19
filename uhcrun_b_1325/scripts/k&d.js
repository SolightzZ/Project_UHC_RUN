import { world, system } from "@minecraft/server";
import { dynamicToast } from "./message";
import { UHCGame } from "./uhc/main.js";

const hit = new Map();
const dead = new Map();

const uhc = (e) => e?.typeId === "minecraft:player" && e.hasTag("uhc");

function log(a, v) {
  if (!a || !v || a.id === v.id) return;
  hit.set(v.id, a);
}

function up(p, id, n = id) {
  let obj = world.scoreboard.getObjective(id) || world.scoreboard.addObjective(id, n);
  obj.addScore(p.scoreboardIdentity, 1);
}

function end(p, k) {
  if (!p) return;

  const n = p.nameTag;
  const { x, y, z } = p.location || {};

  if (uhc(p) && x !== undefined && y !== undefined && z !== undefined) {
    dead.set(n, { x, y, z });
    p.runCommandAsync("function sets/sets");
  }

  if (k && uhc(k)) {
    up(k, "kills");
    world.sendMessage(dynamicToast(`${k.nameTag} killed ${n}`, "textures/items/dye_powder_red"));
    top(k);
  }

  up(p, "deaths");
  hit.delete(p.id);
}

function top(k) {
  if (!k) return;

  UHCGame.broadcast(world.getAllPlayers().filter(uhc), {
    actionBar: "",
    message: `${k.nameTag} §cFirst kill!`,
    title: "§cFirst Kill!",
    subtitle: `${k.nameTag}`,
    sound: "mob.wither.spawn",
  });
}

function tap(e) {
  const { damageSource: s, hurtEntity: h } = e;
  if (!h || !s?.damagingEntity) return;

  const a = s.damagingEntity;
  if (uhc(h) && uhc(a)) {
    log(a, h);
  }
}

function out(e) {
  const { deadEntity: d } = e;
  if (!d || d.typeId !== "minecraft:player") return;

  const k = hit.get(d.id);
  end(d, k);
}

function pop(e) {
  const { player: p } = e;
  const l = dead.get(p.nameTag);

  if (l) {
    if (!p) return;
    p.teleport({ x: l.x + 0.5, y: l.y, z: l.z + 0.5 }, { dimension: p.dimension });
    dead.delete(p.nameTag);
  }
}

function cmd(e) {
  if (e.id !== "kd:clear" || !e.sourceEntity) return;
  if (hit.size > 0) {
    hit.clear();
    console.warn("Cleared attack tracking data.");
  }
}

world.afterEvents.entityHurt.subscribe(tap);
world.afterEvents.entityDie.subscribe(out);
world.afterEvents.playerSpawn.subscribe(pop);
system.afterEvents.scriptEventReceive.subscribe(cmd);
