execute at @a run title @p title §fReset Teams
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
tag @a remove "rank:§c "
tag @a remove "rank:§9 "
tag @a remove "rank:§g "
tag @a remove "rank:§a "
tag @a remove "rank:§5 "
tag @a remove "rank:§b "
tag @a remove "rank:§6 "
tag @a remove "rank:§7 "
tag @a remove "rank:§d "
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
scoreboard players add @a deaths 0
scoreboard players add @a kills 0
tag @a remove player
tag @a add "nametag:§f@s"
scoreboard players set "" uhc 0
function sets/fixtest
scriptevent team:name