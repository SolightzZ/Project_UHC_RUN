title @p title Reset Teams
camera @p fade time 0 0 3 color 0 0 0
playsound random.orb @a
tag @p remove team1
tag @p remove team2
tag @p remove team3
tag @p remove team4
tag @p remove team5
tag @p remove team6
tag @p remove team7
tag @p remove team8
tag @a remove "nametag:§7[]§r §c@s "
tag @a remove "nametag:§7[]§r §9@s "
tag @a remove "nametag:§7[]§r §g@s "
tag @a remove "nametag:§7[]§r §a@s "
tag @a remove "nametag:§7[]§r §d@s "
tag @a remove "nametag:§7[]§r §b@s "
tag @a remove "nametag:§7[]§r §6@s "
tag @a remove "nametag:§7[]§r §7@s "
function sets/score
scoreboard players set @s team1 0
scoreboard players set @s team2 0
scoreboard players set @s team3 0
scoreboard players set @s team4 0
scoreboard players set @s team5 0
scoreboard players set @s team6 0
scoreboard players set @s team7 0
scoreboard players set @s team8 0
function sets/fixtest
tag @a add "nametag: @s "