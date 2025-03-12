import { world, system, GameMode } from "@minecraft/server";

class UHCManager {
  static uhcTick = 0;
  static intervalId = null;
  static centerX = 0;
  static centerZ = 0;
  static spreadDist = 50;
  static maxRange = 500;
  static fixedY = 80;
  static num = 20;
  static teams = ["team1", "team2", "team3", "team4", "team5", "team6", "team7", "team8", "team9"];
  static emptyTeamsLogged = new Set();

  static isPlayerValid(player) {
    try {
      const { dimension, location } = player;
      return !!dimension && !!location && player.isValid();
    } catch {
      return false;
    }
  }

  static spawnTeamParticles() {
    const overworld = world.getDimension("overworld");
    let successCount = 0;
    for (const teamTag of this.teams) {
      const teamPlayers = world.getPlayers({ tags: [teamTag, "uhc"] });
      if (teamPlayers.length === 0) continue;

      const randomPlayer = teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
      if (!this.isPlayerValid(randomPlayer)) continue;

      const { x, y, z } = randomPlayer.location;
      try {
        overworld.spawnParticle("minecraft:huge_explosion_emitter", { x, y: y + 2.5, z });
        successCount++;
      } catch (e) {
        console.warn(`[UHC] ไม่สามารถ spawn particle ให้ทีม ${teamTag}: ${e.message}`);
      }
    }
    return successCount > 0;
  }

  static spreadTeams() {
    const overworld = world.getDimension("overworld");
    let success = false;

    for (const team of this.teams) {
      const teamMembers = world.getPlayers({ tags: [team, "uhc"] });
      if (teamMembers.length === 0) {
        continue;
      }

      const leader = teamMembers[Math.floor(Math.random() * teamMembers.length)];

      let x,
        z,
        attempts = 0;
      do {
        x = Math.floor(this.centerX + (Math.random() * 2 - 1) * this.maxRange);
        z = Math.floor(this.centerZ + (Math.random() * 2 - 1) * this.maxRange);
        attempts++;
      } while (
        (Math.abs(x - this.centerX) < this.spreadDist ||
          Math.abs(z - this.centerZ) < this.spreadDist) &&
        attempts < 100
      );

      if (attempts >= 100) {
        continue;
      }

      const spawnLocation = { x, y: this.fixedY, z };

      leader.teleport(spawnLocation, { dimension: overworld });
      for (const player of teamMembers) {
        if (player !== leader) {
          player.teleport(spawnLocation, { dimension: overworld });
        }
      }
      success = true;
    }
    return success;
  }

  static Timestart() {
    this.uhcTick++;

    const allPlayers = world.getPlayers();
    const uhcPlayers = world.getPlayers({ tags: ["uhc"] });

    this.updatePlayerEffects(allPlayers);
    this.updateUHCPlayers(uhcPlayers);

    if (this.uhcTick > 12) {
      allPlayers.forEach((player) => this.startGame(player));
    }
  }

  static startGame(player) {
    if (this.num < 0) {
      player.onScreenDisplay.setActionBar("");
      return;
    }

    let bar = "";
    const totalBars = 20;
    const greenBars = totalBars - this.num;

    for (let i = 0; i < totalBars; i++) {
      bar += i < greenBars ? "§a▌" : "§f▌";
    }

    const message = `§fGame Start §l\u00BB ${bar} §r${this.num}`;
    player.onScreenDisplay.setActionBar(message);
    if (greenBars > 15) {
      player.playSound("note.pling", { volume: 0.8, pitch: 0.75 });
    }
    this.num--;
  }

  static updatePlayerEffects(players) {
    let affectedPlayers = 0;
    for (const player of players) {
      if (!this.isPlayerValid(player)) continue;

      switch (this.uhcTick) {
        case 1:
          player.onScreenDisplay.setTitle("", {
            stayDuration: 200,
            fadeInDuration: 5,
            fadeOutDuration: 40,
          });
          player.camera.fade({
            fadeTime: { fadeInTime: 1, holdTime: 10, fadeOutTime: 10 },
            fadeColor: { red: 0.1, green: 0.1, blue: 0.1 },
          });
          affectedPlayers++;
          break;
        case 2:
          player.playSound("start", { volume: 0.5, pitch: 1 });
          affectedPlayers++;
          break;
        case 34:
          world.gameRules.showCoordinates = true;
          if (player.inputPermissions) player.inputPermissions.movementEnabled = true;
          player.onScreenDisplay.setTitle("§fGood§aluck!");
          player.playSound("startPlayer", { volume: 1.5, pitch: 0.9 });
          player.playSound("random.explode", { volume: 0.7, pitch: 0.9 });
          affectedPlayers++;
          break;
      }
    }
    return affectedPlayers > 0;
  }

  static updateUHCPlayers(players) {
    let updatedPlayers = 0;
    for (const player of players) {
      if (!this.isPlayerValid(player)) continue;

      switch (this.uhcTick) {
        case 1:
          player.setGameMode(GameMode.adventure);
          if (player.inputPermissions) player.inputPermissions.movementEnabled = false;
          updatedPlayers++;
          break;
        case 7:
          this.spreadTeams();
          updatedPlayers++;
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
          updatedPlayers++;
          break;
        case 34:
          this.spawnTeamParticles();
          player.removeEffect("invisibility");
          player.setGameMode(GameMode.survival);
          updatedPlayers++;
          break;
      }
    }
    return updatedPlayers > 0;
  }
}

export { UHCManager };
