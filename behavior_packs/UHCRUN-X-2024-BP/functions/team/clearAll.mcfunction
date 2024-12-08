execute at @a run title @p title §o§f[ @s ]
execute at @a run title @p subtitle §f §oReset Teams 
execute at @a run camera @p fade time 0 0 3 color 0 0 0
execute at @a run playsound random.orb @a
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team4
tag @p remove team5
tag @p remove team6
tag @p remove team7
tag @p remove team8
tag @p remove team9
tag @a remove "nametag:§7§r §c@s§f"
tag @a remove "nametag:§7§r §9@s§f"
tag @a remove "nametag:§7§r §g@s§f"
tag @a remove "nametag:§7§r §a@s§f"
tag @a remove "nametag:§7§r §5@s§f"
tag @a remove "nametag:§7§r §b@s§f"
tag @a remove "nametag:§7§r §6@s§f"
tag @a remove "nametag:§7§r §7@s§f"
tag @a remove "nametag:§7§r §d@s§f"
function sets/score
scoreboard players set @s team1 0
scoreboard players set @s team2 0
scoreboard players set @s team3 0
scoreboard players set @s team4 0
scoreboard players set @s team5 0
scoreboard players set @s team6 0
scoreboard players set @s team7 0
scoreboard players set @s team8 0
scoreboard players set @s team9 0
tag @a[tag=player] remove player
scoreboard players set "Players" uhc 0
particle rainbowswirl ~~1~ 
function sets/fixtest
tag @a add "nametag: @s"
tag @a[tag=Admin] add "nametag: @s"