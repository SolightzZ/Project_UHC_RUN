camera @a clear
daylock false
gamerule pvp false
gamemode s @a
gamerule falldamage true
tag @a add uhc
time set -500 
effect @a invisibility 120 0 true
effect @a resistance 800 100 true
effect @a regeneration 5 255 true
effect @a saturation 60 255 true
effect @a night_vision infinite 0 true
gamerule randomtickspeed 0
playsound mob.blaze.shoot @a
execute as @a run xp -9999L
scriptevent uhc:start
scriptevent main:start
difficulty e
gamerule domobspawning true
gamerule mobgriefing true
gamerule domobloot true
setworldspawn 0 150 0
gamerule naturalregeneration false
playanimation @a[tag=uhc] animation.humanoid.custom.dab
execute as @a run scriptevent TP:stop
execute in overworld run spreadplayers 600 600 0 10 @a
execute as @a run tag @a add gamemode