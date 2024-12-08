import { world } from "@minecraft/server";

async function executeCommand(player, command) {
  try {
    await player.runCommandAsync(command);
  } catch (error) {
    // แจ้งผู้เล่นหากคำสั่งไม่สำเร็จ
    player.sendMessage("§c [!] ไม่มีผู้เล่นอยู่ใน UHCRun");
  }
}

world.beforeEvents.chatSend.subscribe(async (eventData) => {
  const player = eventData.sender;
  const message = eventData.message.toLowerCase();

  if (player && !player.hasTag("uhc")) {
    if (message.trim() === "!r") {
      eventData.cancel = true; // ปิดกั้นไม่ให้ข้อความแสดงในแชท
      try {
        // ลองเทเลพอร์ตไปยังผู้เล่นที่มีแท็ก "uhc"
        await executeCommand(player, `tp @r[tag=uhc]`);
        // หากสำเร็จ ให้เปลี่ยนเป็นโหมด Spectator
        await executeCommand(player, "gamemode spectator @s");
      } catch {
        // หากไม่มีผู้เล่นใน UHCRun แจ้งเตือนผู้ใช้
        player.sendMessage("§c [!] ไม่มีผู้เล่นอยู่ใน UHCRun");
      }
    }
  }
});
