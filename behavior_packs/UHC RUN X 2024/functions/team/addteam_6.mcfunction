# addteam_6.mcfunction
scoreboard players add @s[tag=!team6] team6 1

execute at @s[tag=!team6] run title @p title §bAqua§f
execute at @s[tag=!team6] run title @p subtitle Add Team 
execute at @s[tag=!team6] run camera @p fade time 0 0 3 color 0 0 0
execute at @s[tag=!team6] run playsound random.orb @a

# Remove tag
tag @s add team6
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team4
tag @p remove team5
tag @p remove team7
tag @p remove team8

function sets/fixtest
function sets/name
execute at @s[tag=!team6] run say >>  §bAqua§f Team 
