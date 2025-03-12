import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
export { Stats };
import { TeleportManager } from "./chat";

async function Stats(player) {
  let kills = getScore(player, "kills") || 0;
  let deaths = getScore(player, "deaths") || 0;
  let kdr = deaths !== 0 ? (kills / deaths).toFixed(2) : kills;
  let platform = getPlatformLabel(player);

  const form = new ActionFormData();
  form.title("UHCRun Profile");
  form
    .body(
      `\n§c  §l\u00BB §rName: §7${player.name}` +
        `\n§6  §l\u00BB §rPlatform: §7${platform}` +
        `\n§g  §l\u00BB §rKills: §7${kills}` +
        `\n§a  §l\u00BB §rDeaths: §7${deaths}` +
        `\n§9  §l\u00BB §rKDR: §7${kdr}\n `
    )
    .button("Next");
  if (player.hasTag("gamemode")) {
    form.button("Back");
  }
  const response = await form.show(player);
  if (response.selection === 0) {
    Closes(player);
  } else if (response.selection === 1) {
    TeleportManager.showFormMenu(player);
  }
}

async function Closes(player) {
  const form2 = new ActionFormData();
  form2.title("UHCRun Tips");
  form2
    .body(
      `\n§d §l\u00BB§r  สามารถพิมพ์ tp ลงในช่องแชทเพื่อเลือก \n    เทเลพอร์ต ไปยังผู้เล่นอื่นๆได้` +
        `\n§5 §l\u00BB§f  ขอบคุณที่มาเล่นนะครับ/ค่ะ \n `
    )
    .button("Back")
    .button("Close");

  const response = await form2.show(player);
  if (response.selection === 0) {
    Stats(player);
  }
}

function getScore(entity, objective) {
  const score = world.scoreboard.getObjective(objective)?.getScore(entity.scoreboardIdentity);
  return score !== undefined ? score : 0;
}

function getPlatformLabel(player) {
  const platformLabels = new Map([
    ["mobile", "Mobile"],
    ["desktop", "Desktop"],
    ["console", "Console"],
  ]);
  return platformLabels.get(player.clientSystemInfo.platformType.toLowerCase()) || "Unknown";
}

function getloop(event) {
  const player = event.sourceEntity;
  if (!player || event.id !== "show:stats") return;

  system.runTimeout(() => {
    Stats(player);
  }, 60);
}

system.afterEvents.scriptEventReceive.subscribe(getloop);
