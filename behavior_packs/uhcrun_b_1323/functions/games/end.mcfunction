scriptevent main:stop
scriptevent uhc:is_stop
scriptevent kd:clear

clear @a
loot replace entity @a[tag=Admin] slot.hotbar 8 loot "solight/compass"
camera @a fade time 0 1 5 color  30 30 30
difficulty p

gamerule pvp false 
gamerule falldamage false
gamerule mobgriefing false
gamerule domobspawning false
gamerule showcoordinates false
gamerule naturalregeneration true
inputpermission set @a movement enabled

##  tag
gamemode a @a
tag @a remove uhc
clearspawnpoint @a
tag @s remove gamemode
hud @a reset item_text
execute as @a run xp -999L
tp @a 596 123 609 
effect @a regeneration 99 255 true
execute as @a run tag @a remove gamemode
effect @a clear
stopsound @a
playsound spawn @a