scriptevent B:d
scriptevent main:stop
scriptevent display:stop
scriptevent uhc:stop
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
execute as @a run xp -999999L
effect @a clear
difficulty p
function sets/Scoreboard
camera @a clear
stopsound @a
inputpermission set @a movement enabled
execute as @a run title @s title 
execute as @a run title @s subtitle Teleport to Spawn
loot replace entity @s slot.hotbar 8 loot "solight/compass"
gamerule naturalregeneration true
playanimation @a[tag=uhc] animation.humanoid.custom.dab
spreadplayers 600 600 0 10 @a
gamerule mobgriefing false
gamerule domobspawning false
playsound mob.blaze.shoot @a
execute as @a run scriptevent TP:stop
execute as @a run tag @a remove gamemode