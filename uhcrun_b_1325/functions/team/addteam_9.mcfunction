# addteam_8.mcfunction

scoreboard players add @s[tag=!team9] team9 1
scoreboard players set @s main -2
scoreboard players add @a deaths 0
scoreboard players add @a kills 0


execute as @s[tag=!team9] run particle team9
execute as @s[tag=!team9] run playsound random.orb @a[r=8] ~ ~ ~ 0.4 1
execute as @s[tag=team9] run playsound note.bassattack
execute as @s[tag=team9] run title @p title §7คุณได้เลือกทีม §dPink§7 แล้ว

execute as @s[tag=!player] run scoreboard players add "" uhc 1
tag @s[tag=!player] add player

# Remove tag
tag @s add team9
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team4
tag @p remove team5
tag @p remove team6
tag @p remove team7
tag @p remove team8
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
function sets/name