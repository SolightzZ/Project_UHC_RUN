scriptevent main:stop
scriptevent display:stop
scriptevent B:d
camera @a fade time 0 1 5 color  30 30 30
clear @a
kill @e[type=item]
gamerule showcoordinates false
gamerule falldamage false
tag @a remove uhc
gamerule pvp false 
spawnpoint @a 600 305 600
clear @a
gamemode a @a
effect @a regeneration 99 255 true
tp @a 600 305 600
playsound mob.blaze.shoot @a
execute as @a run xp -999999L
effect @a clear
scoreboard objectives setdisplay sidebar
scriptevent uhc:stop
difficulty p
camera @a clear
stopsound @a
inputpermission set @a movement enabled
execute as @a run title @s title ❗§f[§f @s §f]§f 
execute as @a run title @s subtitle ❗Teleport to Spawn
loot replace entity @s slot.hotbar 4 loot "solight/compass"