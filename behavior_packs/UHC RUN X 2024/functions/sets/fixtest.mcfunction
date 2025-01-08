
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


scoreboard players set @a[tag=team1] team1 1
execute at @a[scores={team1=1},tag=team1] run scoreboard players add total team1 1
scoreboard players operation @a[scores={team1=1},tag=team1] team1 = total team1 

scoreboard players set @a[tag=team2] team2 1
execute at @a[scores={team2=1},tag=team2] run scoreboard players add total team2 1
scoreboard players operation @a[scores={team2=1},tag=team2] team2 = total team2 

scoreboard players set @a[tag=team3] team3 1
execute at @a[scores={team3=1},tag=team3] run scoreboard players add total team3 1
scoreboard players operation @a[scores={team3=1},tag=team3] team3 = total team3 

scoreboard players set @a[tag=team4] team4 1
execute at @a[scores={team4=1},tag=team4] run scoreboard players add total team4 1
scoreboard players operation @a[scores={team4=1},tag=team4] team4 = total team4

scoreboard players set @a[tag=team5] team5 1
execute at @a[scores={team5=1},tag=team5] run scoreboard players add total team5 1
scoreboard players operation @a[scores={team5=1},tag=team5] team5 = total team5

scoreboard players set @a[tag=team6] team6 1
execute at @a[scores={team6=1},tag=team6] run scoreboard players add total team6 1
scoreboard players operation @a[scores={team6=1},tag=team6] team6 = total team6

scoreboard players set @a[tag=team7] team7 1
execute at @a[scores={team7=1},tag=team7] run scoreboard players add total team7 1
scoreboard players operation @a[scores={team7=1},tag=team7] team7 = total team7

scoreboard players set @a[tag=team8] team8 1
execute at @a[scores={team8=1},tag=team8] run scoreboard players add total team8 1
scoreboard players operation @a[scores={team8=1},tag=team8] team8 = total team8