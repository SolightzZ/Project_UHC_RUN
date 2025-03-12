import { world, Player } from "@minecraft/server";

class CPSChecker {
  static MAX_CPS = 18;
  static lastClickTime = {};
  static clickCount = {};

  static check(player) {
    const currentTime = Date.now();
    const playerName = player.name;

    if (!this.lastClickTime[playerName]) {
      this.initializePlayerData(playerName, currentTime);
      return;
    }

    if (currentTime - this.lastClickTime[playerName] >= 1000) {
      this.resetPlayerClickData(playerName, currentTime);
    } else {
      this.incrementPlayerClickCount(playerName);
    }

    if (this.clickCount[playerName] > this.MAX_CPS) {
      this.handleCPSLimitExceed(player, playerName);
    }
  }

  static initializePlayerData(playerName, currentTime) {
    this.lastClickTime[playerName] = currentTime;
    this.clickCount[playerName] = 0;
  }

  static resetPlayerClickData(playerName, currentTime) {
    this.lastClickTime[playerName] = currentTime;
    this.clickCount[playerName] = 1;
  }

  static incrementPlayerClickCount(playerName) {
    this.clickCount[playerName]++;
  }

  static handleCPSLimitExceed(player, playerName) {
    console.warn(
      `${playerName} ถูกเตะออกเนื่องจากเกินขีดจำกัด CPS: ${this.clickCount[playerName]}/${this.MAX_CPS}`
    );

    world.sendMessage(
      `${playerName} §gถูกเตะออกเนื่องจากเกินขีดจำกัด CPS: §c${this.clickCount[playerName]}/${this.MAX_CPS}`
    );

    player.runCommandAsync(
      `kick "${playerName}" §r \n§fUHC§6Run§7 Made by SolightzZ\n §r\n§g${playerName}§c ถูกเตะออกจากมินิเกมส์ §cเนื่องจาก: เกินขีดจำกัด CPS: §c${this.clickCount[playerName]}/${this.MAX_CPS}§f \n(การตรวจจับการโกงอัตโนมัติ) Discord Sleeplite: §9discord.gg/gtqfbmvTJK`
    );
  }
}

function handleEntityHit(event) {
  const { damagingEntity } = event;
  if (damagingEntity instanceof Player) {
    CPSChecker.check(damagingEntity);
  }
}

world.afterEvents.entityHitEntity.subscribe(handleEntityHit);
