import { world } from "@minecraft/server";

const adminCommands = new Set(["admin", "kill", "list", "help", "world"]);
const gamemodeCommands = new Set(["tp"]);

function getPlayerTags(player) {
  const tags = new Set(player.getTags());
  return {
    isGamemode: tags.has("gamemode"),
    isAdmin: tags.has("Admin") || [...tags].some((tag) => tag.startsWith("rank:")),
    rank: [...tags].find((tag) => tag.startsWith("rank:"))?.substring(5) || " ",
  };
}

function isAllowedCommand(message, { isGamemode, isAdmin }) {
  const words = message.split(/\s+/);
  return words.some(
    (word) => (gamemodeCommands.has(word) && isGamemode) || (adminCommands.has(word) && isAdmin)
  );
}

world.beforeEvents.chatSend.subscribe((data) => {
  const { message, sender } = data;
  const playerTags = getPlayerTags(sender);
  if (isAllowedCommand(message, playerTags)) return;
  data.cancel = true;
  world.sendMessage(`${playerTags.rank}${sender.name} §8§l\u00BB§r§7 ${message}`);
});
