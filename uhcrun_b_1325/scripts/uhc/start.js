import { world, system, GameMode } from "@minecraft/server";

export class UHCManager {
  static uhcTick = 0;
  static num = 25;
  static teams = ["team1", "team2", "team3", "team4", "team5", "team6", "team7", "team8", "team9"];

  static async Teams(world) {
    for (const team of this.teams) {
      const teamMembers = world.getPlayers({ tags: [team, "uhc"] });
      if (!teamMembers.length) continue;
      const leader = teamMembers[0];

      await leader.runCommandAsync(`spreadplayers 0 0 50 486 @s`);
      const leaderPos = leader.location;
      leader.teleport(leaderPos);
      for (const member of teamMembers) {
        if (member !== leader) {
          member.teleport(leaderPos);
        }
      }
    }
  }

  static isValids(player) {
    try {
      const { dimension, location } = player;
      return !!dimension && !!location && player.isValid();
    } catch {
      return false;
    }
  }

  static reset() {
    this.uhcTick = 0;
    this.num = 25;
  }

  static Particles() {
    const overworld = world.getDimension("overworld");
    const processedTeams = new Set();
    for (const teamTag of this.teams) {
      if (processedTeams.has(teamTag)) continue;
      const teamPlayers = world.getPlayers({ tags: [teamTag, "uhc"] });
      if (teamPlayers.length === 0) continue;
      const randomPlayer = teamPlayers[~~(Math.random() * teamPlayers.length)];
      if (!this.isValids(randomPlayer)) continue;
      const { x, y, z } = randomPlayer.location;
      try {
        overworld.spawnParticle("minecraft:huge_explosion_emitter", { x, y: y + 2.5, z });
        processedTeams.add(teamTag);
      } catch (e) {
        console.warn(`[UHC] error spawn particle for ${teamTag}: ${e.message}`);
      }
    }
  }

  static Timestart(uhcPlayers) {
    this.uhcTick++;

    const allPlayers = world.getPlayers();
    this.Effects(allPlayers);
    this._UHC(uhcPlayers);

    if (this.uhcTick > 12) {
      allPlayers.forEach((player) => this.displayGameStart(player));
      if (this.num >= 0) {
        this.num--;
      }
    }

    if (this.uhcTick >= 44) {
      this.reset();
    }
  }

  static displayGameStart(player) {
    if (this.num < 0) {
      player.onScreenDisplay.setActionBar("");
      return;
    }

    let bar = "";
    const totalBars = 25;
    const greenBars = totalBars - this.num;

    for (let i = 0; i < totalBars; i++) {
      bar += i < greenBars ? "§a▌" : "§f▌";
    }

    const message = `§fGame Start §l\u00BB ${bar} §r${this.num}`;
    player.onScreenDisplay.setActionBar(message);
    if (greenBars > 20) {
      player.playSound("note.pling", { volume: 0.8, pitch: 0.75 });
    }
  }

  static Effects(players) {
    let all = 0;
    for (const player of players) {
      if (!this.isValids(player)) continue;

      switch (this.uhcTick) {
        case 1:
          player.onScreenDisplay.setTitle("", {
            stayDuration: 200,
            fadeInDuration: 5,
            fadeOutDuration: 40,
          });
          player.camera.fade({
            fadeTime: { fadeInTime: 0, holdTime: 10, fadeOutTime: 10 },
            fadeColor: { red: 0.1, green: 0.1, blue: 0.1 },
          });
          all++;
          break;
        case 2:
          player.playSound("start", { volume: 0.5, pitch: 1 });
          all++;
          break;
        case 39:
          world.gameRules.showCoordinates = true;
          if (player.inputPermissions) player.inputPermissions.movementEnabled = true;
          player.onScreenDisplay.setTitle("§fGood§aluck!");
          player.playSound("startPlayer", { volume: 1.5, pitch: 0.9 });
          player.playSound("random.explode", { volume: 0.7, pitch: 0.9 });
          all++;
          break;
      }
    }
    return all > 0;
  }

  static _UHC(players) {
    let TagPlayer = 0;
    for (const player of players) {
      if (!this.isValids(player)) continue;

      switch (this.uhcTick) {
        case 1:
          player.setGameMode(GameMode.adventure);
          if (player.inputPermissions) player.inputPermissions.movementEnabled = false;
          TagPlayer++;
          break;
        case 7:
          this.Teams(world);
          TagPlayer++;
          break;
        case 24:
          player.runCommandAsync(
            `loot replace entity @a[tag=uhc] slot.hotbar 0 loot "solight/stone_axe"`
          );
          player.runCommandAsync(
            `loot replace entity @a[tag=uhc] slot.hotbar 1 loot "solight/stone_pickaxe"`
          );
          player.runCommandAsync(
            `replaceitem entity @a[tag=uhc] slot.hotbar 2 minecraft:cooked_beef 3`
          );
          player.runCommandAsync(`replaceitem entity @a[tag=uhc] slot.hotbar 3 minecraft:boat`);
          TagPlayer++;
          break;
        case 39:
          this.Particles();
          player.removeEffect("invisibility");
          player.setGameMode(GameMode.survival);
          TagPlayer++;
          break;
      }
    }
    return TagPlayer > 0;
  }
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (!event.sourceEntity) return;
  switch (event.id) {
    case "start:clear":
    case "s:c":
      UHCManager.reset();
      break;
  }
});
