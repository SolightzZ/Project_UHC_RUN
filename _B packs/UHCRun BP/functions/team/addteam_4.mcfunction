# addteam_4.mcfunction
scoreboard players add @s[tag=!team4] team4 1

scoreboard players set @s main -2
#
execute at @s[tag=!team4] run say ==>  §aGreen§f Team 
execute at @s[tag=!team4] run title @p title §aGreen§f
execute at @s[tag=!team4] run title @p subtitle Add Team 
execute at @s[tag=!team4] run camera @p fade time 0 0 3 color 0 0 0
execute at @s[tag=!team4] run playsound random.orb @a

execute at @s[tag=!player] run scoreboard players add "Players" uhc 1
tag @s[tag=!player] add player

# Remove tag
tag @s add team4
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team5
tag @p remove team6
tag @p remove team7
tag @p remove team8
tag @p remove team9

function sets/fixtest
function sets/name
