# addteam_2.mcfunction 
scoreboard players add @p[tag=!team2] team2 1
scoreboard players set @s main -2
scoreboard players add @a deaths 0
scoreboard players add @a kills 0

# Visual and audio feedback for joining
execute as @s[tag=!team2] run particle team2
execute as @s[tag=!team2] run playsound random.orb @a[r=8] ~ ~ ~ 0.4 0.65
execute as @s[tag=team2] run playsound note.bassattack
execute as @s[tag=team2] run title @p title §7คุณได้เลือกทีม §9Blue§7 แล้ว

execute as @s[tag=!player] run scoreboard players add "" uhc 1
tag @s[tag=!player] add player

# Remove tag
tag @s add team2
tag @s remove team1
tag @s remove team3
tag @s remove team4
tag @s remove team5
tag @s remove team6
tag @s remove team7
tag @s remove team8
tag @p remove team9
tag @a[tag=!team1] remove "rank:§c "
tag @a[tag=!team2] remove "rank:§9 "
tag @a[tag=!team3] remove "rank:§g "
tag @a[tag=!team4] remove "rank:§a "
tag @a[tag=!team5] remove "rank:§5 "
tag @a[tag=!team6] remove "rank:§b "
tag @a[tag=!team7] remove "rank:§6 "
tag @a[tag=!team8] remove "rank:§7 "
tag @a[tag=!team9] remove "rank:§d "


function sets/fixtest
# Display 
function sets/name

