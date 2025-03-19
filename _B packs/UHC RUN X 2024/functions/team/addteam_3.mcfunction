# addteam_3.mcfunction
scoreboard players add @s[tag=!team3] team3 1

# TEST tag team
execute at @s[tag=!team3] run title @p title  §gYellow§f
execute at @s[tag=!team3] run camera @p fade time 0 0 3 color 0 0 0
execute at @s[tag=!team3] run title @p subtitle Add Team 
execute at @s[tag=!team3] run playsound random.orb @a

# Remove tag
tag @s add team3
tag @p remove team1
tag @p remove team2
tag @p remove team4
tag @p remove team5
tag @p remove team6
tag @p remove team7
tag @p remove team8

function sets/fixtest
function sets/name
execute at @s[tag=!team3] run say >>  §gYellow§f Team 
