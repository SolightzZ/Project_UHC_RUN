structure load uhc 569 285 569
setblock 569 287 569 air
clear @a
tag @a remove uhc
tag @s add Admin
tag @s add Emote
tellraw @a {"rawtext":[{"text":"\n§f [] Sleeplite Event Christmas x UHCRUN\n \n Created by : Sleeplite Server\n Disocrd: discord.gg/gtqfbmvTJK\n§r "}]}
gamemode a @a
setworldspawn 600 300 600
effect @a regeneration 3 255 true
effect @a saturation 3 255 true
gamerule commandblockoutput false 
gamerule doweathercycle false
gamerule doimmediaterespawn false
gamerule commandblockoutput false
gamerule spawnradius 10
gamerule sendcommandfeedback false
gamerule falldamage false
difficulty p
function sets/Obgect
gamerule domobspawning false
gamerule mobgriefing false
gamerule domobloot false
kill @e[type=item]
camera @a clear
gamerule pvp false
inputpermission set @a movement enabled
loot replace entity @a slot.hotbar 8 loot "solight/compass"
gamerule naturalregeneration true
function sets/display_start
function team/clearAll
execute as @a run title @a title ❗
execute as @a run title @a subtitle Loading Scripes ...
spreadplayers 600 600 0 10 @a
playsound c11 @a ~ ~ ~ 0.3
gamerule showcoordinates false
spawnpoint @a 600 300 600
execute in overworld run spreadplayers 600 600 0 10 @a
scriptevent B:d
scriptevent main:stop
scriptevent uhc:stop
execute as @a run tag @a remove gamemode