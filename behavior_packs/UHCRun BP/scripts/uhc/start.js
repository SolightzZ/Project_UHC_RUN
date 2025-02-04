import { system } from "@minecraft/server";

let isRunning = false;
let uhc = 0;
let uhcInterval = null; // ตัวแปรสำหรับเก็บ interval

function stopUhc(player) {
  if (!isRunning) return;
  isRunning = false;
  if (uhcInterval) {
    system.clearRun(uhcInterval);
    uhcInterval = null;
  }
}

function startUhc(player) {
  if (isRunning) return; // ป้องกันการเริ่มใหม่ถ้ากำลังรันอยู่

  isRunning = true;
  uhc = 0;

  const actions = [
    {
      tick: 1,
      commands: [
        "camera @a fade time 0 10 10 color 30 30 30",
        "execute as @a run inputpermission set @a movement disabled",
        "gamerule showcoordinates false",
      ],
    },
    {
      tick: 5,
      commands: [
        "playsound c15 @a",
        "camera @a fade time 1 1 1 color 30 30 30",
        "execute as @a run title @s title ",
        "execute as @a run title @s subtitle  §f@s + 500 -",
      ],
    },
    {
      tick: 6,
      commands: [
        "spreadplayers 1 1 100 480 @a[tag=uhc]",
        "/function sets/W_set",
        "function sets/team",
      ],
    },
    {
      tick: 15,
      commands: [
        "function sets/team",
        "function sets/W_set",
        "function sets/block",
      ],
    },
    {
      tick: 16,
      command: "/function sets/block",
    },
    {
      tick: 20,
      command: "/function sets/block",
    },
    {
      tick: 26,
      commands: [
        "function sets/team",
        "function sets/block",
        "function sets/W_set",
        "execute at @a run playsound note.bit @a ~ ~ ~ 1 1",
        "function sets/loot",
      ],
    },
    {
      tick: 28,
      commands: [
        "camera @a fade time 0 10 10 color 30 30 30",
        "title @a title §c█████",
        "execute at @a run playsound note.bit @a ~ ~ ~ 1 1.1",
      ],
    },
    {
      tick: 30,
      commands: [
        "title @a title §a█§c████",
        "execute at @a run playsound note.bit @a ~ ~ ~ 1 1.2",
      ],
    },
    {
      tick: 32,
      commands: [
        "title @a title §a██§c███",
        "execute at @a run playsound note.bit @a ~ ~ ~ 1 1.3",
      ],
    },
    {
      tick: 34,
      commands: [
        "title @a title §a███▌§c██",
        "execute at @a run playsound note.bit @a ~ ~ ~ 1 1.4",
      ],
    },
    {
      tick: 36,
      commands: [
        "title @a title §a████§c█",
        "execute at @a run playsound note.bit @a ~ ~ ~ 1 1.5",
      ],
    },
    {
      tick: 38,
      commands: [
        "title @a title §a█████",
        "execute at @a run playsound note.bit @a ~ ~ ~ 1 1.6",
      ],
    },
    {
      tick: 39,
      commands: ["function sets/clear_block", "effect @a clear invisibility"],
    },
    {
      tick: 40,
      endGame: true,
    },
  ];

  uhcInterval = system.runInterval(() => {
    if (!isRunning) return;
    uhc++;

    const currentAction = actions.find((action) => action.tick === uhc);

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
    player.sendMessage(" [!] Start §aEnable!");
  } else if (event.id === "uhc:stop") {
    stopUhc(player);
    player.sendMessage(" [!] Start §cDisable!");
  }
});
