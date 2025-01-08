title @a title §k§f!!§r §gTeam Winner §f§k!!§r§f
title @a subtitle §e >> @a[tag=uhc] <<
playsound win @a
execute as @a[tag=uhc] run summon fireworks_rocket ~ ~ ~ 
execute as @a at @s run tellraw @s {"rawtext":[{"text":"\n §7-------------------------§r \n \n "},{"text":"              §k§f!§r §gWinner §k§f!§r \n   "},{"selector":"@a[tag=uhc] "},{"text":"\n \n §7-------------------------§r"}]}