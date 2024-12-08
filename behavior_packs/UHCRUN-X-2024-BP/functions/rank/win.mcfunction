title @a title §gWinner 
playsound win @a
execute as @e[tag=uhc] at @e[tag=uhc] run particle so:light1 ~~15~
playanimation @a[tag=uhc] animation.humanoid.baile animation.humanoid.baile
execute as @a at @s run tellraw @s {"rawtext":[{"text":"\n §7-------------------------§r \n \n "},{"text":"              §k§f!§r §gWinner §k§f!§r \n   "},{"selector":"@e[tag=uhc] "},{"text":"\n \n §7-------------------------§r"}]}