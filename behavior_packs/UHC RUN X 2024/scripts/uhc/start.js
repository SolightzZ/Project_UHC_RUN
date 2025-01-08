import { system } from "@minecraft/server";

let isRunning = false;
let uhc = 0;

function stopUhc(player) {
  isRunning = false;
  player.runCommandAsync("/function sets/start");
}

function startUhc(player) {
  if (isRunning) return;
  isRunning = true;
  uhc = 0;
  const actions = [
    {
      tick: 1,
      commands: [
        "inputpermission set @a movement disabled",
        "function sets/display_stop",
        "gamerule showcoordinates false",
      ],
    },
    {
      tick: 5,
      commands: [
        "spreadplayers 1 1 1 450 @a[tag=uhc]",
        "function sets/team",
        "camera @a fade time 0 10 10 color 30 30 30",
      ],
    },
    { tick: 8, command: "fill ~-1 100 ~-1 ~1 100 ~1 glass" },
    { tick: 9, command: "fill ~-1 100 ~-1 ~1 100 ~1 glass" }, // This could be removed since it's identical to tick 8
    { tick: 10, command: "fill ~-1 100 ~-1 ~1 100 ~1 glass" }, // Same here
    { tick: 11, command: "fill ~-1 100 ~-1 ~1 100 ~1 glass" }, // Same here
    { tick: 12, command: "fill ~-1 100 ~-1 ~1 100 ~1 glass" }, // Same here
    {
      tick: 22,
      commands: [
        "title @a title §c▌▌▌▌▌",
        "playsound random.click",
        "/function sets/loot",
      ],
    },
    {
      tick: 24,
      commands: ["title @a title §a▌§c▌▌▌▌", "playsound random.click @a"],
    },
    {
      tick: 26,
      commands: ["title @a title §a▌▌§c▌▌▌", "playsound random.click @a"],
    },
    {
      tick: 28,
      commands: ["title @a title §a▌▌▌§c▌▌", "playsound random.click @a"],
    },
    {
      tick: 30,
      commands: ["title @a title §a▌▌▌▌§c▌", "playsound random.click @a"],
    },
    {
      tick: 32,
      commands: ["title @a title §a▌▌▌▌▌", "playsound random.click @a"],
    },
    {
      tick: 33,
      commands: [
        "fill ~-1 100 ~-1 ~1 100 ~1 air",
        "inputpermission set @a movement enabled",
        "playsound c17 @a",
        "title @a title ❗",
        "title @a title ❗Good §aluck",
        "function sets/display_start",
        "gamerule showcoordinates true",
      ],
    },
    {
      tick: 50,
      commands: [
        "playsound mob.enderdragon.flap @a ~ ~ ~ 0.7",
        'tellraw @a {"rawtext":[{"text":" [+] UHC§6RUN §7Made by SolightzZ"}]}',
      ],
    },
    {
      tick: 55,
      endGame: true,
    },
  ];

  system.runInterval(() => {
    if (!isRunning) return;
    uhc++;

    const currentAction = actions.find((action) => action.tick === uhc);

    if (uhc <= 33) {
      player.runCommandAsync(
        "execute as @a run particle bd:cirno_power ~ ~-2 ~ "
      );
    }

    if (currentAction) {
      if (currentAction.command) {
        player.runCommandAsync(currentAction.command);
      }
      if (currentAction.commands) {
        currentAction.commands.forEach((cmd) => player.runCommandAsync(cmd));
      }
      if (currentAction.endGame) {
        stopUhc(player);
      }
    }
  }, 20);
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const player = event.sourceEntity;
  if (event.id === "uhc:start") {
    startUhc(player);
  } else if (event.id === "uhc:stop") {
    stopUhc(player);
  }
});
