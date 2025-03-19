scoreboard objectives remove main 
scoreboard objectives add main dummy ""
scoreboard objectives setdisplay list main

execute at @s[tag=!team1] run scoreboard players add "Red" main 1
execute at @s[tag=!team2] run scoreboard players add "Blue" main 1
execute at @s[tag=!team3] run scoreboard players add "Yellow" main 1
execute at @s[tag=!team4] run scoreboard players add "Green" main 1
execute at @s[tag=!team5] run scoreboard players add "Purple" main 1
execute at @s[tag=!team6] run scoreboard players add "Aqua" main 1
execute at @s[tag=!team7] run scoreboard players add "Orange" main 1
execute at @s[tag=!team8] run scoreboard players add "Gray" main 1
execute at @s[tag=!team9] run scoreboard players add "Pink" main 1