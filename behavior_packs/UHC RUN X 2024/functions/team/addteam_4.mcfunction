# addteam_4.mcfunction
scoreboard players add @s[tag=!team4] team4 1

#
execute at @s[tag=!team4] run title @p title §aGreen§f
execute at @s[tag=!team4] run title @p subtitle Add Team 
execute at @s[tag=!team4] run camera @p fade time 0 0 3 color 0 0 0
execute at @s[tag=!team4] run playsound random.orb @a

# Remove tag
tag @s add team4
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team5
tag @p remove team6
tag @p remove team7
tag @p remove team8

function sets/fixtest
function sets/name
execute at @s[tag=!team4] run say >>  §aGreen§f Team 