import { system } from "@minecraft/server";

let stop = false;
function stopCounting(player) {
  stop = false;
}

function start(player) {
  if (stop) return;
  stop = true;

  system.runInterval(() => {
    if (!stop) return;

    player.runCommandAsync(`function sets/display`);
  }, 40);
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;

  if (event.id === "display:start") {
    start(player);
    player.sendMessage(" [!] Display Active!");
  } else if (event.id === "display:stop") {
    stopCounting(player);
    player.sendMessage(" [!] Display Disabled!");
  }
});
