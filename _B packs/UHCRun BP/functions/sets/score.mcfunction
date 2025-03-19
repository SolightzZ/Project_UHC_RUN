# score.mcfunction
scoreboard objectives remove main 
scoreboard objectives add main dummy ""
scoreboard objectives setdisplay list main
scoreboard players set "§l§8***********" main -1

tag @a remove team1
tag @a remove team2
tag @a remove team3
tag @a remove team4
tag @a remove team5
tag @a remove team6
tag @a remove team7
tag @a remove team8
tag @a remove team9
scoreboard objectives add team1 dummy
scoreboard players set @a team1 0
scoreboard objectives add team2 dummy
scoreboard players set @a team2 0
scoreboard objectives add team3 dummy
scoreboard players set @a team3 0
scoreboard objectives add team4 dummy
scoreboard players set @a team4 0
scoreboard objectives add team5 dummy
scoreboard players set @a team5 0
scoreboard objectives add team6 dummy
scoreboard players set @a team6 0
scoreboard objectives add team7 dummy
scoreboard players set @a team7 0
scoreboard objectives add team8 dummy
scoreboard players set @a team8 0
scoreboard objectives add team9 dummy
scoreboard players set @a team9 0