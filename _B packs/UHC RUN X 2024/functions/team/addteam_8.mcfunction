# addteam_8.mcfunction
scoreboard players add @s[tag=!team8] team8 1

execute at @s[tag=!team8] run title @p title §8Gray§f
execute at @s[tag=!team8] run title @p subtitle Add Team 
execute at @s[tag=!team8] run camera @p fade time 0 0 3 color 0 0 0
execute at @s[tag=!team8] run playsound random.orb @a

# Remove tag
tag @s add team8
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team4
tag @p remove team5
tag @p remove team6
tag @p remove team7

function sets/fixtest
function sets/name
execute at @s[tag=!team8] run say >>  §7Gray§f Team 