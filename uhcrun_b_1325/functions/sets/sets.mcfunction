playsound ambient.weather.thunder @a ~ ~ ~ 0.2 0.85 500
playsound kill @a ~ ~ ~ 0.8 0.95 500
gamemode spectator @s
execute as @s[tag=uhc] run scoreboard players remove "" uhc 1
execute as @s[tag=uhc] run structure load death ~~1~
execute as @s[tag=uhc] run particle so:light2 ~~4.5~
execute as @s[tag=uhc] run particle so:light5 ~~6.5~
execute at @e[type=hopper_minecart,c=1] run tp @e[type=item,r=16] ~ ~0.1 ~ 
scoreboard players reset @s[tag=uhc] main
tag @s[tag=uhc] add gamemode
tag @s remove uhc

function sets/remove
function sets/fixtest
function sets/name
effect @a conduit_power infinite 0 true
scriptevent show:stats