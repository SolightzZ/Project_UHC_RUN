## SCoredoard objectives add
scoreboard objectives remove main 
scoreboard objectives add main dummy ""
scoreboard objectives add uhc dummy ""
scoreboard objectives add kills dummy
scoreboard objectives add deaths dummy

## SCoredoard players
scoreboard players add @a deaths 0
scoreboard players add @a kills 0
scoreboard players add "" uhc 0

## SCoredoard Systems
scoreboard players set " Tick" uhc 0
scoreboard players set " Border" uhc 0
scoreboard players add "" uhc 0 

## SCoredoard setdisplay
scoreboard objectives setdisplay list main
scoreboard objectives setdisplay sidebar uhc ascending
scoreboard players add "§l═══════" main -1