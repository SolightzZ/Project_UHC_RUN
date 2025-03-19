import { world } from "@minecraft/server";

const adminCmds = new Set(["admin", "kill", "list", "help", "world"]);
const gmCmds = new Set(["tp"]);

function getTags(p) {
  const t = new Set(p.getTags());
  return {
    isGm: t.has("gamemode"),
    isAdmin: t.has("Admin") || [...t].some((tag) => tag.startsWith("rank:")),
    rank: [...t].find((tag) => tag.startsWith("rank:"))?.substring(5) || " ",
  };
}

function checkCmd(msg, { isGm, isAdmin }) {
  const w = msg.split(/\s+/);
  return w.some((cmd) => (gmCmds.has(cmd) && isGm) || (adminCmds.has(cmd) && isAdmin));
}

world.beforeEvents.chatSend.subscribe((e) => {
  const { message, sender } = e;
  const tags = getTags(sender);
  if (checkCmd(message, tags)) return;
  e.cancel = true;
  world.sendMessage(`${tags.rank}${sender.name} §8§l\u00BB§r§7 ${message}`);
});
