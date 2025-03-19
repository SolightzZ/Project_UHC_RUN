execute at @s[tag=uhc]  run scoreboard players add "Players" uhc -1
execute at @s[tag=uhc]  run particle bd:cirno_defeat2 ^^2^
execute at @s[tag=uhc]  run gamemode spectator @s
execute at @s[tag=uhc]  run title @a title §o✕
execute at @s[tag=uhc]  run title @a subtitle §f@s
execute at @s[tag=uhc] run structure load chest ~ ~2 ~ 
execute at @s[tag=uhc] as @a run playsound kill @a
execute at @s[tag=uhc] run particle so:light2 ~~1.2~
execute at @s[tag=uhc] run particle so:light5 ~~5.5~
tag @s remove uhc
tag @s[tag=team1] remove team1
tag @s[tag=team2] remove team2
tag @s[tag=team3] remove team3
tag @s[tag=team4] remove team4
tag @s[tag=team5] remove team5
tag @s[tag=team6] remove team6
tag @s[tag=team7] remove team7
tag @s[tag=team8] remove team8
tag @s[tag=team9] remove team9
scoreboard players reset @s[tag=uhc] main
function sets/fixtest
function sets/name
effect @a night_vision infinite 0 true