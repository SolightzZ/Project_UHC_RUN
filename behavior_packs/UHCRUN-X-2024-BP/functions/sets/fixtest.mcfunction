
scoreboard objectives remove team1
scoreboard objectives add team1 dummy
scoreboard objectives remove team2
scoreboard objectives add team2 dummy
scoreboard objectives remove team3
scoreboard objectives add team3 dummy

scoreboard objectives remove team4
scoreboard objectives add team4 dummy

scoreboard objectives remove team5
scoreboard objectives add team5 dummy

scoreboard objectives remove team6
scoreboard objectives add team6 dummy

scoreboard objectives remove team7
scoreboard objectives add team7 dummy

scoreboard objectives remove team8
scoreboard objectives add team8 dummy
scoreboard objectives remove team9
scoreboard objectives add team9 dummy


scoreboard players set @a[tag=team1] team1 1
scoreboard players set " §cRed§f" main 0
execute at @a[scores={team1=1},tag=team1] run scoreboard players add total team1 1
scoreboard players operation @a[scores={team1=1},tag=team1] team1 = total team1
scoreboard players operation " §cRed§f" main = @a[tag=team1] team1

scoreboard players set @a[tag=team2] team2 1
scoreboard players set " §9Blue§f" main 0
execute at @a[scores={team2=1},tag=team2] run scoreboard players add total team2 1
scoreboard players operation @a[scores={team2=1},tag=team2] team2 = total team2 
scoreboard players operation " §9Blue§f" main = @a[tag=team2] team2

scoreboard players set @a[tag=team3] team3 1
scoreboard players set " §gYellow§f" main 0
execute at @a[scores={team3=1},tag=team3] run scoreboard players add total team3 1
scoreboard players operation @a[scores={team3=1},tag=team3] team3 = total team3 
scoreboard players operation " §gYellow§f" main = @a[tag=team3] team3

scoreboard players set @a[tag=team4] team4 1
scoreboard players set " §aGreen§f" main 0
execute at @a[scores={team4=1},tag=team4] run scoreboard players add total team4 1
scoreboard players operation @a[scores={team4=1},tag=team4] team4 = total team4
scoreboard players operation " §aGreen§f" main = @a[tag=team4] team4

scoreboard players set @a[tag=team5] team5 1
scoreboard players set " §5Purple§f" main 0
execute at @a[scores={team5=1},tag=team5] run scoreboard players add total team5 1
scoreboard players operation @a[scores={team5=1},tag=team5] team5 = total team5
scoreboard players operation " §5Purple§f" main = @a[tag=team5] team5

scoreboard players set @a[tag=team6] team6 1
scoreboard players set " §bAqua§f" main 0
execute at @a[scores={team6=1},tag=team6] run scoreboard players add total team6 1
scoreboard players operation @a[scores={team6=1},tag=team6] team6 = total team6
scoreboard players operation " §bAqua§f" main = @a[tag=team6] team6

scoreboard players set @a[tag=team7] team7 1
scoreboard players set " §6Orange§f" main 0
execute at @a[scores={team7=1},tag=team7] run scoreboard players add total team7 1
scoreboard players operation @a[scores={team7=1},tag=team7] team7 = total team7
scoreboard players operation " §6Orange§f" main = @a[tag=team7] team7

scoreboard players set @a[tag=team8] team8 1
scoreboard players set " §7Gray§f" main 0
execute at @a[scores={team8=1},tag=team8] run scoreboard players add total team8 1
scoreboard players operation @a[scores={team8=1},tag=team8] team8 = total team8
scoreboard players operation " §7Gray§f" main = @a[tag=team8] team8

scoreboard players set @a[tag=team9] team9 1
scoreboard players set " §dPink§f" main 0
execute at @a[scores={team9=1},tag=team9] run scoreboard players add total team9 1
scoreboard players operation @a[scores={team9=1},tag=team9] team9 = total team9
scoreboard players operation " §dPink§f" main = @a[tag=team9] team9