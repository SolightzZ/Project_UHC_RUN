<p align="center">
  <img src="https://github.com/SolightzZ/Project_UHC_RUN/blob/main/Original%20Packs/title.png" alt="Title Image">
</p>

<br>

# ระบบ WorldBorder Dimension

การทำงานของ WorldBorder ในแต่ละมิติ:
- **Overworld**: ขอบเขตเริ่มต้นที่ 500 บล็อก
- **Nether**: ขอบเขตเริ่มต้นที่ 57 บล็อก
- **การทำงานของ WorldBorder**: ครอบคลุมทั้ง 4 ทิศบนแกน X
- **การลดขอบเขต**: ใน Overworld ทุกการเดิน 8 บล็อกจะลดขอบเขตของ Nether ลง 1 บล็อก
- **ขอบเขตสูงสุด**: หากเดินออกนอกขอบเขต 500 บล็อก ระบบจะย้ายผู้เล่นกลับ 1.5 บล็อกและสร้างกำแพง WorldBorder

<br>

# ระบบ Overworld Generation
การปรับปรุงโอกาสในการเจอแร่:
- เพิ่มความหาง่ายของ **Diamond, Emerald, Gold, Iron, Lapis, Redstone**
- **Obsidian และ Quartz** ถูกเพิ่มเข้าใน Overworld
- ลบ **Copper** ออกจากเกม

<br>

# ระบบ Loot Tables
การดรอปไอเทมพิเศษจากสัตว์และมอนสเตอร์:
- **Book**: มีโอกาสดรอปจาก **Cow, Horse, Llama, Rabbit**
- **TNT**: มีโอกาสดรอปจาก **Creeper**
- **Ender Pearl** (100%): ดรอปจาก **Enderman**
- เมื่อฆ่าสัตว์จะได้รับเนื้อที่สุกแล้ว

# ระบบ Random Items
การดรอปไอเทมสุ่ม:
- **Lapis Ore**: มีโอกาสดรอป **Obsidian** หรือ **Book** (1-2%)
- **Gravel**: มีโอกาสดรอป **Arrow** (0.30%)
- **Leaves**: มีโอกาสดรอป **Apple** (0.20%) รวมถึงใบไม้ทุกชนิด เช่น oak, spruce, birch, jungle, acacia, dark oak, mangrove และ cherry leaves

<br>


# ระบบ Enchant Items
ระบบการเอนชานท์เอง
<br>

- **Wooden Tools**: 
  - Wooden Axe
  - Wooden Pickaxe
  - Wooden Shovel

- **Stone Tools**: 
  - Stone Shovel
  - Stone Pickaxe
  - Stone Axe

- **Iron Tools**: 
  - Iron Shovel
  - Iron Pickaxe
  - Iron Axe

- **Golden Tools**: 
  - Golden Shovel
  - Golden Pickaxe
  - Golden Axe

- **Diamond Tools**: 
  - Diamond Axe
  - Diamond Shovel
  - Diamond Pickaxe
    
**ไอเทมสามารถเอนชานท์ได้เฉพาะ Unbreaking 3 และ Efficiency 3 เท่านั้น:**

---
- **Hoes**:
  - Wooden Hoe
  - Stone Hoe
  - Iron Hoe
  - Golden Hoe
  - Diamond Hoe
    
**ไอเทมสามารถเอนชานท์ได้เฉพาะ Unbreaking 3 และ Efficiency 3 และ Fortune 3 เท่านั้น:**

<br>


# ระบบ Nametag
ระบบเปลี่ยนชื่อผู้เล่นในเกมโดยใช้คำสั่ง:
- ชื่อผู้เล่นจะหายเมื่อออกจากเกมและกลับมาใหม่เมื่อเข้าสู่เกมโดยการใช้คำสั่งเท่านั้น

<br>


# ระบบ Death Count
นับจำนวนการตายผ่าน JavaScript API ของ Minecraft Bedrock:
- หากผู้เล่นมีแท็ก **uhc** จะเข้าสู่ **Spectator Mode** หลังการตาย และเกิดใหม่ที่จุดตายพร้อมแสดงกล่องการตายและนับจำนวนการตาย

<br>


# ระบบ Kill Counter สำหรับผู้เล่นหลายคน
นับจำนวนการฆ่า (Kill) สำหรับผู้เล่นหลายคน:
- ผู้เล่นสามารถแย่ง Kill ได้ โดยนับจำนวนการ Kill และแสดงผล

<br>


## ระบบ Auto Smelt
การเผาแร่ดิบอัตโนมัติเมื่อเก็บแร่ใน inventory:
- **Raw Iron**: เปลี่ยนเป็น **Iron Ingot**
- **Raw Gold**: เปลี่ยนเป็น **Gold Ingot**
- ระบบทำงานเฉพาะเมื่อมีช่องว่างใน inventory อย่างน้อย 1 ช่อง

<br>


# ระบบ Scoreboard Action Bar
แสดงผลข้อมูลบน Action Bar:
- จำนวนผู้เล่นในทีมแต่ละสี
- จำนวน kill ที่ผู้เล่นทำได้
- เวลา tick ของเกม
- เวลาของวง WorldBorder

<br>


## ระบบ Java Saturation
การเพิ่มค่าการฟื้นฟูอิ่ม (Saturation) แบบ Java:
- อาหารที่เพิ่มระดับ saturation: **Bread, Cooked Beef, Golden Carrot**

<br>


# ระบบ Recipes เพิ่มสูตรการคราฟใหม่
เพิ่มสูตรการคราฟและการคราฟแบบกลับคืน:
- **Enchanted Book** สามารถใส่ในช่องคราฟเพื่อกลับเป็น **Book**
- **Enchanted Diamond Sword** สามารถใส่ในช่องคราฟเพื่อกลับเป็น **Diamond Sword**

<br>


# ระบบอื่นๆ
- **TNT**: เพิ่มดาเมจเป็น 2 และสามารถขยับได้
- ระบบ **Tag Team**: สนับสนุนระบบทีม
- **Max Health** ของผู้เล่นเพิ่มเป็น 40
- ลบสิ่งมีชีวิตที่ไม่จำเป็นออกจากเกม

<br>

