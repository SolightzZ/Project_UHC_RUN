execute at @s run spawnpoint @s[tag=uhc] ~ ~ ~1
execute at @s run spawnpoint @s[tag=uhc] ~ ~ ~1
execute at @s run spawnpoint @s[tag=uhc] ~ ~ ~1
execute at @s run spawnpoint @s[tag=uhc] ~ ~ ~1
execute at @s run spawnpoint @s[tag=uhc] ~ ~ ~1
execute at @s[tag=uhc]  run particle bd:cirno_defeat2 ^^2^
execute at @s[tag=uhc]  run gamemode spectator @s
execute at @s[tag=uhc]  run title @a title 
execute at @s[tag=uhc]  run title @a subtitle §c@s
execute at @s[tag=uhc] run structure load chest ~ ~2 ~ 
tag @s remove uhc
tag @s[tag=team1] remove team1
tag @s[tag=team2] remove team2
tag @s[tag=team3] remove team3
tag @s[tag=team4] remove team4
tag @s[tag=team5] remove team5
tag @s[tag=team6] remove team6
tag @s[tag=team7] remove team7
tag @s[tag=team8] remove team8
function sets/fixtest
effect @a night_vision 3000 0 true
playsound kill @a
particle snow ~~25~