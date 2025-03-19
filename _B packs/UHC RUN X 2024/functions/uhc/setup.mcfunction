structure load uhc 569 259 569
clear @a
tag @a remove uhc
tellraw @a {"rawtext":[{"text":"§f  - Christmas x UHCRUN\nCreated by : Sleeplite Industry\n§r "}]}
gamemode a @a
playsound c9 @a ~ ~ ~ 0.4
setworldspawn 0 296 0
spawnpoint @a 1 296 1
effect @a regeneration 3 255 true
effect @a saturation 3 255 true
gamerule commandblockoutput false 
gamerule doweathercycle false
gamerule doimmediaterespawn true
gamerule commandblockoutput false
gamerule sendcommandfeedback false
gamerule falldamage false
gamerule mobgriefing false
gamerule domobspawning false
difficulty p
scriptevent display:start
scoreboard objectives add kills dummy
scoreboard objectives add uhc dummy
scoreboard objectives add main dummy
scoreboard objectives add deaths dummy
scoreboard players add @a deaths 0
scoreboard players add @a kills 0
scoreboard players set "tick" uhc 0
gamerule domobspawning false
gamerule mobgriefing false
gamerule domobloot false
kill @e[type=item]
camera @a clear
gamerule pvp false
inputpermission set @a movement enabled
title @a title ❗§f[§f @s §f]§f 
title @a subtitle ❗Loading Structures
loot replace entity @s slot.hotbar 4 loot "solight/compass"
tp @a 600 405 600