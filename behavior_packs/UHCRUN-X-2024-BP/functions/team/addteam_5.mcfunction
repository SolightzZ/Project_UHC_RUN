# addteam_5.mcfunction
scoreboard players add @s[tag=!team5] team5 1

scoreboard players set @s main -2

execute at @s[tag=!team5] run say ==>  §5Purple§f Team 
execute at @s[tag=!team5] run title @p title §5Purple§f
execute at @s[tag=!team5] run title @p subtitle Add Team 
execute at @s[tag=!team5] run camera @p fade time 0 0 3 color 0 0 0
execute at @s[tag=!team5] run playsound random.orb @a

execute at @s[tag=!player] run scoreboard players add "Players" uhc 1
tag @s[tag=!player] add player

# Remove tag
tag @s add team5
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team4
tag @p remove team6
tag @p remove team7
tag @p remove team8
tag @p remove team9

function sets/fixtest
function sets/name
