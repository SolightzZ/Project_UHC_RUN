import { world, system, GameMode } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Stats } from "./FromD.js";

class TeamManager {
  static teamMappings = new Map([
    ["team1", { name: "§cRed Team", texture: "textures/items/dye_powder_red" }],
    ["team2", { name: "§9Blue Team", texture: "textures/items/dye_powder_blue_new" }],
    ["team3", { name: "§gYellow Team", texture: "textures/items/dye_powder_yellow" }],
    ["team4", { name: "§aGreen Team", texture: "textures/items/dye_powder_lime" }],
    ["team5", { name: "§5Purple Team", texture: "textures/items/dye_powder_purple" }],
    ["team6", { name: "§bAqua Team", texture: "textures/items/dye_powder_light_blue" }],
    ["team7", { name: "§6Orange Team", texture: "textures/items/dye_powder_orange" }],
    ["team8", { name: "§7Gray Team", texture: "textures/items/dye_powder_silver" }],
    ["team9", { name: "§dPink Team", texture: "textures/items/dye_powder_pink" }],
  ]);

  static getAvailableTeams() {
    return [...this.teamMappings.keys()].filter((tag) =>
      world.getPlayers().some((player) => player.hasTag(tag))
    );
  }
}

class TeleportManager {
  static async tpA(player) {
    system.runTimeout(() => {
      player.playSound("note.hat", { volume: 0.9, pitch: 0.95 });
      this.showFormMenu(player);
    }, 35);
  }

  static async showFormMenu(player) {
    const forms = new ActionFormData();
    const teams = TeamManager.getAvailableTeams();

    forms
      .title("Teleport to UHC Player")
      .body("§eSelect a team or player to teleport.")
      .button(`Player ${world.getPlayers().length} Online`)
      .button("UHCRun Profile");

    teams.forEach((teamTag) => {
      const team = TeamManager.teamMappings.get(teamTag);
      forms.button(team.name, team.texture);
    });

    const result = await forms.show(player);
    if (!result.canceled && result.selection !== undefined) {
      if (result.selection === 0) {
        this.showFormAllPlayers(player);
      } else if (result.selection === 1) {
        Stats(player);
      } else {
        const selectedTeam = teams[result.selection - 2];
        this.showTeamPlayersForm(player, selectedTeam);
      }
    }
  }

  static async showFormAllPlayers(player) {
    const allPlayers = world.getPlayers();
    const forms = new ActionFormData();
    forms.title(`Player ${allPlayers.length} Online`).body("§eSelect a player to teleport.");

    allPlayers.forEach((p) => forms.button(p.name, "textures/ui/xbox4"));
    forms.button("§cBack");

    const result = await forms.show(player);
    if (!result.canceled && result.selection !== undefined) {
      if (result.selection === allPlayers.length) {
        this.showFormMenu(player);
      } else {
        this.teleportToPlayer(player, allPlayers[result.selection]);
      }
    }
  }

  static async showTeamPlayersForm(player, teamTag) {
    const team = TeamManager.teamMappings.get(teamTag);
    if (!team) return;

    const teamPlayers = world.getPlayers().filter((p) => p.hasTag(teamTag));
    const forms = new ActionFormData();
    forms.title(team.name).body("§eSelect a player to teleport.");

    teamPlayers.forEach((teamPlayer) => forms.button(teamPlayer.name, team.texture));
    forms.button("§cBack");

    const result = await forms.show(player);
    if (!result.canceled && result.selection !== undefined) {
      if (result.selection === teamPlayers.length) {
        this.showFormMenu(player);
      } else {
        this.teleportToPlayer(player, teamPlayers[result.selection]);
      }
    }
  }

  static async teleportToPlayer(player, targetPlayer) {
    if (player.hasTag("gamemode")) {
      const targetLocation = {
        x: targetPlayer.location.x + Math.random() * 2 - 1,
        y: targetPlayer.location.y,
        z: targetPlayer.location.z + Math.random() * 2 - 1,
      };

      const teleportOptions = {
        dimension: targetPlayer.dimension,
        facingLocation: {
          x: targetPlayer.location.x - 1,
          y: targetPlayer.location.y + 1,
          z: targetPlayer.location.z - 1,
        },
        checkForBlocks: true,
      };

      await player.teleport(targetLocation, teleportOptions);
      await player.setGameMode(GameMode.spectator);
      await player.runCommandAsync("effect @s conduit_power infinite 255 true");
    }
  }
}
export { TeleportManager };

async function sum(eventData) {
  const player = eventData.sender;
  const message = eventData.message.trim().toLowerCase();

  if (message === "tp" && player.hasTag("gamemode")) {
    eventData.cancel = true;
    await TeleportManager.tpA(player);
  }
}

world.beforeEvents.chatSend.subscribe(sum);
