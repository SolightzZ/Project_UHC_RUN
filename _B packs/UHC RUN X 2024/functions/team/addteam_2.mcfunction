# addteam_2.mcfunction 
scoreboard players add @p[tag=!team2] team2 1

# Visual and audio feedback for joining
execute at @s[tag=!team2] run title @p title §9Blue§f
execute at @s[tag=!team2] run camera @p fade time 0 0 3 color 0 0 0
execute at @s[tag=!team2] run title @p subtitle Add Team
execute at @s[tag=!team2] run playsound random.orb @a

# Remove tag
tag @s add team2
tag @s remove team1
tag @s remove team3
tag @s remove team4
tag @s remove team5
tag @s remove team6
tag @s remove team7
tag @s remove team8


function sets/fixtest
# Display 
function sets/name
execute at @s[tag=!team2] run say >>  §9Blue§f Team
