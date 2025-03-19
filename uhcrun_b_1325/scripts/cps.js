import { world, Player } from "@minecraft/server";

const CPS = {
  max: 18,
  last: new WeakMap(),
  hits: new WeakMap(),
  wait: new Map(),

  test(p) {
    try {
      if (!(p instanceof Player)) throw new Error("Not a player");
      const now = Date.now();
      const id = p.name;

      if (!id || typeof id !== "string") throw new Error("Bad name");

      if (this.wait.has(id)) return;
      this.wait.set(id, true);

      if (!this.last.has(p)) {
        this.set(p, now);
      } else if (now - this.last.get(p) >= 1000) {
        this.new(p, now);
      } else {
        this.up(p);
      }

      if (this.hits.get(p) > this.max) {
        this.out(p, id);
      }

      this.wait.delete(id);
    } catch (e) {
      console.warn(`Test Error: ${e.message}`);
      world.sendMessage(`§cError for ${p.name || "unknown"}: ${e.message}`);
      this.wait.delete(id);
    }
  },

  set(p, t) {
    try {
      if (typeof t !== "number") throw new Error("Bad time");
      this.last.set(p, t);
      this.hits.set(p, 0);
    } catch (e) {
      console.warn(`Set Error for ${p.name}: ${e.message}`);
    }
  },

  new(p, t) {
    try {
      if (typeof t !== "number") throw new Error("Bad time");
      this.last.set(p, t);
      this.hits.set(p, 1);
    } catch (e) {
      console.warn(`New Error for ${p.name}: ${e.message}`);
    }
  },

  up(p) {
    try {
      if (!this.hits.has(p) && this.hits.get(p) !== 0) throw new Error("Hits not set");
      this.hits.set(p, this.hits.get(p) + 1);
    } catch (e) {
      console.warn(`Up Error for ${p.name}: ${e.message}`);
    }
  },

  async out(p, id) {
    try {
      console.warn(`${id} out for CPS: ${this.hits.get(p)}/${this.max}`);
      world.sendMessage(`${id} §gout for CPS: §c${this.hits.get(p)}/${this.max}`);

      await p.runCommandAsync(
        `kick "${id}" §r \n§fUHC§6Run§7 Made by SolightzZ\n §r\n§g${id}§c out from game §cfor: CPS over: §c${this.hits.get(
          p
        )}/${this.max}§f \n(Auto-cheat) Discord: §9discord.gg/gtqfbmvTJK`
      );
    } catch (e) {
      console.warn(`Out Error for ${id}: ${e.message}`);
      world.sendMessage(`§cFailed to out ${id}: ${e.message}`);
      try {
        await p.runCommandAsync(`kick "${id}" §cCPS over`);
      } catch (f) {
        console.warn(`Backup Out Error for ${id}: ${f.message}`);
      }
    }
  },
};

function tap(e) {
  try {
    const { damagingEntity: d } = e;
    if (!(d instanceof Player)) return;
    CPS.test(d);
  } catch (e) {
    console.warn(`Tap Error: ${e.message}`);
    world.sendMessage(`§cError in tap: ${e.message}`);
  }
}

world.afterEvents.entityHitEntity.subscribe(tap, { maxEventsPerTick: 100 });
