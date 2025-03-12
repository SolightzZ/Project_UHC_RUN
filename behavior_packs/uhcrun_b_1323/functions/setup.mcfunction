structure load uhc1 569 100 569
tickingarea add -48 0 -48 48 0 48 uhc_area
scriptevent main:stop
scriptevent uhc:is_stop
function sets/Obgect
function team/clearAll

clear @a
difficulty p
gamemode a @a
camera @a clear
tag @s add Admin
tag @a remove uhc
playsound spawn @a
tag @s[tag=Admin] add "rank: " 

kill @e[type=item,r=32]
clearspawnpoint @a
setworldspawn 596 125 622
spreadplayers 596 609 1 2 @a 160
execute as @a run title @s title 
inputpermission set @a movement enabled
execute as @a run tag @a remove gamemode
execute as @a run title @s subtitle structure load
loot replace entity @a slot.hotbar 8 loot "solight/compass"

effect @a regeneration 50 255 true
effect @a resistance 100 255 true
effect @a saturation 50 255 true

gamerule sendcommandfeedback false
gamerule commandblockoutput false 
gamerule naturalregeneration true
gamerule doimmediaterespawn true
gamerule showcoordinates false
gamerule doweathercycle false
gamerule domobspawning false
gamerule mobgriefing false
gamerule falldamage false
gamerule domobloot false
gamerule spawnradius 5
gamerule pvp false

execute as @a at @s run tellraw @s {"rawtext":[{"text":" §7\n §8---------------------------\n§f §bSleeplite§f Project \n §8---------------------------\n§f Created by : §bSleeplite §fServer\n Disocrd : §9discord.gg/gtqfbmvTJK\n§8 ---------------------------"}]}