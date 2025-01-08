daylock false
camera @a fade time 0 10 10 color 30 30 30
gamerule pvp false
gamerule showcoordinates true
gamemode s @a
gamerule falldamage true
tag @a add uhc
time set -500 
effect @a invisibility 30 1 true
effect @a resistance 700 100 true
effect @a speed 700 0 true
effect @a regeneration 5 255 true
effect @a slow_falling 10 255 true
effect @a saturation 10 255 true
effect @a night_vision 9999 1 true
effect @a haste 700 1 true
gamerule randomtickspeed 0
playsound mob.blaze.shoot @a
execute as @a run xp -999999L
scriptevent uhc:start
scriptevent main:start
difficulty e
scoreboard objectives add kill dummy
scoreboard players set "Border" uhc 0
scoreboard players set @a kill 0
gamerule domobspawning true
gamerule mobgriefing true
gamerule domobloot true
setworldspawn 0 150 0
execute as @a run title @s title ❗§f[§f @s §f]§f 
title @a subtitle ❗Random area §f[500]
playsound c15 @a