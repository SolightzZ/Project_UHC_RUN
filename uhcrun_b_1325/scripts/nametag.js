import * as mc from "@minecraft/server";

mc.system.run(function run() {
  mc.system.run(run);

  for (let p of mc.world.getPlayers()) {
    let tag = p.getTags().find((t) => t.startsWith("nametag:"));
    if (tag) {
      p.removeTag(tag);
      tag = tag.replace("nametag:", "").replaceAll("@s", p.name).replaceAll("\\n", "\n");
      p.nameTag = tag;
    }
  }
});
