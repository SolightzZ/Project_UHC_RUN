# addteam_5.mcfunction
scoreboard players add @s[tag=!team5] team5 1

execute at @s[tag=!team5] run title @p title §dPurple§f
execute at @s[tag=!team5] run title @p subtitle Add Team 
execute at @s[tag=!team5] run camera @p fade time 0 0 3 color 0 0 0
execute at @s[tag=!team5] run playsound random.orb @a

# Remove tag
tag @s add team5
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team4
tag @p remove team6
tag @p remove team7
tag @p remove team8

function sets/fixtest
function sets/name
execute at @s[tag=!team5] run say >>  §dPurple§f Team 