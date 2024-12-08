import * as Minecraft from "@minecraft/server";

Minecraft.system.run(function tick() {
  Minecraft.system.run(tick);

  for (let player of Minecraft.world.getPlayers()) {
    let nametag = player.getTags().find((tag) => tag.startsWith("nametag:"));
    if (nametag) {
      player.removeTag(nametag);
      nametag = nametag
        .replace("nametag:", "")
        .replaceAll("@s", player.name)
        .replaceAll("\\n", "\n");
      player.nameTag = nametag;
    }
  }
});
