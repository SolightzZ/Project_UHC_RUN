title @a title §gVictory!
playsound win @a
execute as @a[tag=uhc] at @a[tag=uhc] run particle so:light1 ~~15~
playanimation @a[tag=uhc] animation.humanoid.baile animation.humanoid.baile
execute as @a at @s run tellraw @s {"rawtext":[{"text":"\n "},{"text":"   §k§f!§r §gVictory! §k§f!§r \n "},{"selector":"@e[tag=uhc] "},{"text":"\n \n §7§r"}]}