import { world, system } from "@minecraft/server";

let uhc = 0;
let main_stop = false;

async function stopUhc(player) {
  main_stop = false;
  await player.runCommandAsync("/function sets/scoreboard");
}

async function startUhc(player) {
  if (main_stop) return;

  main_stop = true;
  uhc = 0;

  const actions = [
    {
      tick: 70,
      command: async () => {
        await player.runCommandAsync(
          `tellraw @a {"rawtext":[{"text":" [!] §cPVP Disabled"}]}`
        );
        await player.runCommandAsync("gamerule pvp false");
        await player.runCommandAsync("playsound beacon.deactivate @a");
      },
    },
    {
      tick: 100,
      command: async () => {
        await player.runCommandAsync(
          `tellraw @a {"rawtext":[{"text":" [!] §cWorld Border Active in 600"}]}`
        );
        await player.runCommandAsync("function sets/border");
        await player.runCommandAsync("playsound noti @a ~~~ 0.1");
      },
      title: "❗§aBorder enabled",
    },
    {
      tick: 875,
      command: async () => player.runCommandAsync("playsound random.click @a"),
      title: "PVP Enabled\n§a§l5",
    },
    {
      tick: 880,
      command: async () => player.runCommandAsync("playsound random.click @a"),
      title: "§a§l4",
    },
    {
      tick: 885,
      command: async () => player.runCommandAsync("playsound random.click @a"),
      title: "§e§l3",
    },
    {
      tick: 890,
      command: async () => player.runCommandAsync("playsound random.click @a"),
      title: "§6§l2",
    },
    {
      tick: 895,
      command: async () => player.runCommandAsync("playsound random.click @a"),
      title: "§c§l1",
    },
    {
      tick: 900,
      command: async () => {
        await player.runCommandAsync("gamerule pvp true");
        await player.runCommandAsync(
          `tellraw @a {"rawtext":[{"text":" [!] §aPVP Enabled"}]}`
        );
        await player.runCommandAsync(
          "playsound mob.enderdragon.growl @a ~~~ 0.1"
        );
      },
      title: "§aPVP Enabled",
    },
  ];

  system.runInterval(async () => {
    if (!main_stop) return;

    uhc++;

    for (const action of actions) {
      if (uhc === action.tick) {
        await action.command();
        if (action.title) {
          await player.runCommandAsync(`title @a title ${action.title}`);
        }
      }
    }

    if (uhc === 950) {
      await player.runCommandAsync("gamerule mobgriefing false");
      await player.runCommandAsync("gamerule domobspawning false");
    }

    if (uhc === 2500) {
      await stopUhc(player);
    }
  }, 20);
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;

  if (event.id === "main:start") {
    startUhc(player);
  } else if (event.id === "main:stop") {
    stopUhc(player);
  }
});
