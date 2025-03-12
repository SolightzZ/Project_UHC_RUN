function sets/tagUHC
scriptevent main:start
scriptevent uhc:is_now
scriptevent kd:clear

effect @a conduit_power infinite 0 true
effect @a[tag=uhc] invisibility infinite 255 true
effect @a[tag=uhc] regeneration 5 255 true
effect @a[tag=uhc] resistance 40 255 true
effect @a[tag=uhc] saturation 120 255 true

difficulty e
time set -100 
gamerule randomtickspeed 0


camera @a clear
hud @a hide item_text
hud @a hide status_effects
playanimation @a animation.armor_stand.athena_pose
execute as @a run xp -9999L

gamerule naturalregeneration false
gamerule showcoordinates false
gamerule domobspawning true
gamerule mobgriefing true
gamerule falldamage true
gamerule domobloot true
gamerule pvp false
daylock false

gamemode spectator @a[tag=!uhc]
tag @a[tag=Admin] add "rank: " 
tag @a[tag=uhc] remove "rank: " 
tag @a[tag=uhc] remove gamemode
tag @a[tag=!uhc] add gamemode 
execute as @a[tag=!uhc] run say Spectator 
spreadplayers 0 0 30 485 @a[tag=uhc]