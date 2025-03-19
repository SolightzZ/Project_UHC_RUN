import { system, world } from "@minecraft/server";
import { dynamicToast } from "../message.js";
import { UHCManager } from "./start.js";

class UHCGame {
  static isRunning = false;
  static tickCount = 0;
  static borderRadius = 500;
  static borderEnd = 5;
  static timeToShrink = 370;
  static center = { x: 0, z: 0 };
  static maxParticles = 50;
  static borderProximity = 32;
  static particleSpacing = 1.6;
  static countdownTimes = new Set([90, 15, 5, 4, 3, 2, 1]);
  static borderWarnings = new Set([450, 400, 350, 300, 250, 200, 150, 100, 50]);
  static teamTags = [
    "team1",
    "team2",
    "team3",
    "team4",
    "team5",
    "team6",
    "team7",
    "team8",
    "team9",
  ];

  static TEAMS = [
    { tag: "team1", color: "§c", name: " Red" },
    { tag: "team2", color: "§9", name: " Blue" },
    { tag: "team3", color: "§g", name: " Yellow" },
    { tag: "team4", color: "§a", name: " Green" },
    { tag: "team5", color: "§5", name: " Purple" },
    { tag: "team6", color: "§b", name: " Aqua" },
    { tag: "team7", color: "§6", name: " Orange" },
    { tag: "team8", color: "§7", name: " Gray" },
    { tag: "team9", color: "§d", name: " Pink" },
  ];

  static countdownId = null;
  static checkIntervalId = null;

  static startGame() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tickCount = 0;
    this.borderRadius = 500;
    this.runGameLoop();
  }

  static stopGame() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.tickCount = 0;
    this.borderRadius = 500;
    if (this.checkIntervalId) system.clearRun(this.checkIntervalId);
    if (this.countdownId) system.clearRun(this.countdownId);
    this.checkIntervalId = null;
    this.countdownId = null;
  }

  static async broadcast(players, { message, title, subtitle, sound, actionBar }) {
    const commands = [];
    for (const player of players) {
      if (message) commands.push(player.sendMessage(message));
      if (title || subtitle) {
        commands.push(
          player.onScreenDisplay.setTitle(title, {
            stayDuration: 200,
            fadeInDuration: 10,
            fadeOutDuration: 20,
            subtitle: subtitle || "",
          })
        );
      }
      if (sound) commands.push(player.playSound(sound, { volume: 0.8, pitch: 1 }));
      if (actionBar) commands.push(player.onScreenDisplay.setActionBar(actionBar));
    }
    await Promise.all(commands);
  }

  static Warning(player) {
    const { x, z, y } = player.location;
    if (Math.abs(x) > this.borderRadius || Math.abs(z) > this.borderRadius) {
      player.dimension.spawnParticle("arrow", {
        x: x + ((this.center.x - x) / (Math.hypot(this.center.x - x, this.center.z - z) || 1)) * 2,
        y: y + 1,
        z: z + ((this.center.z - z) / (Math.hypot(this.center.x - x, this.center.z - z) || 1)) * 2,
      });
      if (Math.random() < 0.65) {
        player.onScreenDisplay.setActionBar("§cWorld Border !");
        player.playSound("hit.netherite");
        player.applyDamage(3, { cause: "void", damagingEntity: null });
        player.camera.fade({
          fadeTime: { fadeInTime: 0, holdTime: 0, fadeOutTime: 0.5 },
          fadeColor: { red: 0.5, green: 0.1, blue: 0.1 },
        });
      }
    }
  }

  static getDistance(location) {
    return Math.min(
      Math.abs(this.center.x + this.borderRadius - location.x),
      Math.abs(this.center.x - this.borderRadius - location.x),
      Math.abs(this.center.z + this.borderRadius - location.z),
      Math.abs(this.center.z - this.borderRadius - location.z)
    );
  }

  static MaxDistance({ x, z }) {
    return Math.max(Math.abs(x), Math.abs(z));
  }

  static Particles(player) {
    const { location, dimension } = player;
    const distanceToBorder = this.getDistance(location);
    if (distanceToBorder > this.borderProximity) return;

    const intensity = Math.max(0, 1 - distanceToBorder / this.borderProximity);
    const particleRange =
      Math.min((Math.sqrt(this.maxParticles) * this.particleSpacing) / 1.5, this.borderProximity) *
      intensity;
    const particles = [];

    const addP = (x, y, z) => {
      const dx = Math.abs(x - location.x);
      const dz = Math.abs(z - location.z);
      if (dx <= 128 && dz <= 128) particles.push({ x, y: Math.max(-64, Math.min(320, y)), z });
    };

    const borderCorners = [
      { x: this.center.x + this.borderRadius },
      { x: this.center.x - this.borderRadius },
      { z: this.center.z + this.borderRadius },
      { z: this.center.z - this.borderRadius },
    ];

    for (const corner of borderCorners) {
      const dx = corner.x ? Math.abs(corner.x - location.x) : 0;
      const dz = corner.z ? Math.abs(corner.z - location.z) : 0;
      if (Math.sqrt(dx * dx + dz * dz) > this.borderProximity) continue;

      for (let xOffset = -particleRange; xOffset < particleRange; xOffset += this.particleSpacing) {
        for (
          let yOffset = -particleRange;
          yOffset < particleRange;
          yOffset += this.particleSpacing
        ) {
          const particleX =
            corner.x ??
            Math.max(
              this.center.x - this.borderRadius,
              Math.min(this.center.x + this.borderRadius, location.x + xOffset)
            );
          const particleZ =
            corner.z ??
            Math.max(
              this.center.z - this.borderRadius,
              Math.min(this.center.z + this.borderRadius, location.z + xOffset)
            );
          addP(particleX, location.y + yOffset, particleZ);
        }
      }
    }

    const shuffled = particles.sort(() => Math.random() - 0.5).slice(0, this.maxParticles);
    for (const { x, y, z } of shuffled) {
      dimension.spawnParticle("borderX", { x, y: y + 2, z });
    }
  }

  static Score(player) {
    if (!world.getPlayers().some((p) => p.id === player.id)) return;
    const scoreboard = world.scoreboard;
    const objective = scoreboard.getObjective("uhc") || scoreboard.addObjective("uhc", "");
    objective.setScore(" Border", ~~this.borderRadius);
    objective.setScore(" Tick", this.tickCount);
  }

  static check(uhcPlayers) {
    if (!this.isRunning || this.tickCount <= 60) return;
    const activeTeams = new Set(
      uhcPlayers.map((p) => this.teamTags.find((tag) => p.hasTag(tag))).filter(Boolean)
    );
    if (activeTeams.size === 1) this.down();
  }

  static down() {
    if (this.countdownId) return;
    let timeLeft = 120;
    const allPlayers = world.getAllPlayers();

    this.countdownId = system.runInterval(async () => {
      if (timeLeft > 0) {
        await this.broadcast(allPlayers, {
          actionBar: `§c Game Over §f§l\u00BB §r§f${timeLeft} §c! `,
          message: "",
          title: "",
          subtitle: "",
          sound: "",
        });
        if (timeLeft === 115 && this.checkIntervalId) system.clearRun(this.checkIntervalId);
        if (timeLeft === 115) await this.Victory();
        if (timeLeft <= 5)
          await this.broadcast(allPlayers, {
            actionBar: "",
            message: "",
            title: "",
            subtitle: "",
            sound: "note.pling",
          });
      } else if (timeLeft === 0) {
        await world.getDimension("overworld").runCommandAsync("function games/end");
        this.stopGame();
      } else {
        system.clearRun(this.countdownId);
        this.countdownId = null;
      }
      timeLeft--;
    }, 20);
  }

  static async Victory() {
    const uhcPlayers = world.getAllPlayers().filter((p) => p.hasTag("uhc"));
    if (!uhcPlayers.length) return world.sendMessage("§cNo winners found!");

    let winningTeamTag = null;
    for (const tag of this.teamTags) {
      const teamMembers = uhcPlayers.filter((p) => p.hasTag(tag));
      if (teamMembers.length > 0) {
        winningTeamTag = tag;
        break;
      }
    }

    if (!winningTeamTag) return world.sendMessage("§cNo winning team found!");

    const winningTeam = this.TEAMS.find((t) => t.tag === winningTeamTag);
    const teamName = winningTeam
      ? `${winningTeam.color}${winningTeam.name}`
      : `§c${winningTeamTag}`;
    const teamColor = winningTeam ? winningTeam.color : "§c";
    const teamMembers = uhcPlayers.filter((p) => p.hasTag(winningTeamTag));

    for (const player of teamMembers) {
      world.getDimension(player.dimension.id).spawnEntity("minecraft:fireworks_rocket", {
        x: player.location.x,
        y: player.location.y + 1,
        z: player.location.z,
      });
    }

    await this.broadcast(world.getAllPlayers(), {
      actionBar: "",
      message: "",
      title: "§g§lVictory",
      subtitle: `${teamName} Win`,
      sound: "win",
    });

    let message = `\n§8----- §g+ Victory + §8------\n`;
    message += `${teamName} : ${teamColor}${teamMembers.map((p) => p.name).join("§f, ")}\n`;
    message += "§8----------------------\n";

    world.sendMessage(message);
  }

  static async BorderWarning(uhcPlayers) {
    const radius = ~~this.borderRadius;
    if (!this.borderWarnings.has(radius)) return;
    this.borderWarnings.delete(radius);
    if (uhcPlayers.length) {
      await this.broadcast(uhcPlayers, {
        actionBar: "",
        message: ` World Border Warning §c${radius} §fBlock`,
        title: "",
        subtitle: "",
        sound: "noti",
      });
    }
  }

  static adjustBorder() {
    if (this.tickCount < 900 || this.tickCount > 3000) return;
    const shrinkRate = (this.borderRadius - this.borderEnd) / this.timeToShrink;
    const adjustment = this.tickCount <= 1200 ? 0.3 : this.tickCount <= 1800 ? 0.1 : -0.1;
    this.borderRadius = Math.max(this.borderEnd, this.borderRadius - shrinkRate + adjustment);
  }

  static runGameLoop() {
    this.checkIntervalId = system.runInterval(async () => {
      if (!this.isRunning) return;

      this.tickCount++;
      const players = world.getPlayers();
      const uhcPlayers = players.filter((p) => p.hasTag("uhc"));

      await Promise.all(uhcPlayers.map((p) => this.Score(p)));
      this.check(uhcPlayers);
      await this.BorderWarning(uhcPlayers);
      this.adjustBorder();

      if (this.tickCount >= 0 && this.tickCount <= 44) {
        UHCManager.Timestart(uhcPlayers);
      }

      for (const player of uhcPlayers) {
        const distanceToBorder = this.getDistance(player.location);
        const maxDistance = this.MaxDistance(player.location);
        if (distanceToBorder <= this.borderProximity && maxDistance <= this.borderRadius) {
          this.Particles(player);
        } else if (maxDistance > this.borderRadius) {
          this.Warning(player);
          this.Particles(player);
        }
      }

      const time = 900 - this.tickCount;
      if (this.countdownTimes.has(time) && uhcPlayers.length) {
        world.sendMessage(
          dynamicToast(
            `§cWorld Border Active \nin §g${time} §ctick`,
            "textures/ui/ErrorGlyph_small_hover",
            "textures/ui/beacon_button_locked"
          )
        );
        await this.broadcast(players, {
          actionBar: "",
          message: "",
          title: "",
          subtitle: "",
          sound: "note.pling",
        });
      }

      this.Events_(players);
    }, 20);
  }

  static async Events_(players) {
    switch (this.tickCount) {
      case 60:
        await this.broadcast(players, {
          actionBar: "",
          message: "  : §cPVP Disabled",
          title: "§cDisabled!",
          subtitle: "การต่อสู้ถูก§cปิด§fแล้ว!",
          sound: "noti",
        });
        world.gameRules.pvp = false;
        break;
      case 120:
        await this.broadcast(players, {
          actionBar: "",
          message: "  : World Border Active in §c900§f tick",
          title: "§l§c!",
          subtitle: "เขตแดนเจะเริ่มทำงานในอีก 720 วินาที",
          sound: "noti",
        });
        break;
      case 200:
        world.sendMessage(
          dynamicToast(
            `§fUHC§6Run §7Made by SolightzZ`,
            "textures/uhc/solightzz",
            "textures/ui/purpleBorder"
          )
        );
        await this.broadcast(players, {
          actionBar: "",
          message: "",
          title: "",
          subtitle: "",
          sound: "note.pling",
        });
        break;
      case 900:
        await this.broadcast(players, {
          actionBar: "",
          message: "§fWorld Border §aActive!",
          title: "",
          subtitle: "เขตแดนเริ่มทำงานแล้ว!",
          sound: "world_noti",
        });
        break;
      case 680:
        await this.broadcast(players, {
          actionBar: "",
          message: " §6 : PVP Enabled in 20 tick!",
          title: "§6Enabled in",
          subtitle: "จะเปิดการต่อสู้ในอีก 20 วินาที !",
          sound: "noti",
        });
        break;
      case 694:
        await this.broadcast(players, {
          actionBar: "",
          message: "PVP in §c§l3 tick",
          title: "",
          subtitle: "",
          sound: "note.pling",
        });
        break;
      case 696:
        await this.broadcast(players, {
          actionBar: "",
          message: "PVP in §6§l2 tick",
          title: "",
          subtitle: "",
          sound: "note.pling",
        });
        break;
      case 698:
        await this.broadcast(players, {
          actionBar: "",
          message: "PVP in §g§l1 tick",
          title: "",
          subtitle: "",
          sound: "world_noti",
        });
        break;
      case 700:
        await this.broadcast(players, {
          actionBar: "",
          message: "  : §aPVP Enabled",
          title: "§a- Enabled -",
          subtitle: "§fเปิดการต่อสู้แล้ว!",
          sound: "note.pling",
        });
        world.gameRules.pvp = true;
        break;
      case 1700:
        await this.broadcast(players, {
          actionBar: "",
          message: "§cMob Spawn Disabled",
          title: "",
          subtitle: "§fปิดการเกิดม็อบแล้ว!",
          sound: "world_noti",
        });
        world.gameRules.mobGriefing = false;
        world.gameRules.doMobSpawning = false;
        break;
    }
  }
}

export { UHCGame };

system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (!event.sourceEntity) return;
  switch (event.id) {
    case "main:start":
      UHCGame.startGame();
      break;
    case "main:stop":
      UHCGame.stopGame();
      break;
  }
});
