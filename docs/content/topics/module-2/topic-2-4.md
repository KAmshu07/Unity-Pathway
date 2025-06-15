# Object-Oriented Programming

## Introduction

Object-Oriented Programming (OOP) is like building with LEGO blocks. Instead of writing everything as one big mess, you create separate "blueprints" (called classes) that describe how things should work. Then you can make as many copies of those things as you need! This makes your code organized, reusable, and much easier to understand.

## What Are Classes and Objects?

Think of a class as a blueprint or recipe. An object is what you make from that blueprint.

- **Class = Recipe for cookies** 🍪
- **Object = Actual cookies you baked**

You can use one recipe to make many cookies, and each cookie can be different (chocolate chip, oatmeal, etc.).

### Your First Class

```csharp
using UnityEngine;

// This is a class - a blueprint for a player
public class Player
{
    // Properties - what the player has
    public string playerName;
    public int health;
    public int level;
    public float speed;
    
    // Constructor - runs when you create a new player
    public Player()
    {
        playerName = "New Player";
        health = 100;
        level = 1;
        speed = 5.0f;
        Debug.Log("A new player was created!");
    }
    
    // Another constructor with custom name
    public Player(string name)
    {
        playerName = name;
        health = 100;
        level = 1;
        speed = 5.0f;
        Debug.Log($"Player {name} was created!");
    }
    
    // Methods - what the player can do
    public void Introduce()
    {
        Debug.Log($"Hi! I'm {playerName}, level {level} with {health} health!");
    }
    
    public void TakeDamage(int damage)
    {
        health -= damage;
        if (health < 0) health = 0;
        Debug.Log($"{playerName} took {damage} damage! Health: {health}");
    }
    
    public void Heal(int healAmount)
    {
        health += healAmount;
        if (health > 100) health = 100;
        Debug.Log($"{playerName} healed {healAmount}! Health: {health}");
    }
    
    public void LevelUp()
    {
        level++;
        health = 100;  // Full heal on level up
        Debug.Log($"{playerName} leveled up to level {level}!");
    }
}

// Script to test our Player class
public class PlayerTester : MonoBehaviour
{
    void Start()
    {
        // Creating objects from our class
        Player player1 = new Player();
        Player player2 = new Player("Alex");
        Player player3 = new Player("Jordan");
        
        // Each player is separate!
        player1.Introduce();
        player2.Introduce();
        player3.Introduce();
        
        // They can do different things
        player1.TakeDamage(30);
        player2.TakeDamage(50);
        player3.Heal(20);  // Already full, so no change
        
        player2.LevelUp();
        
        // Check them again
        player1.Introduce();
        player2.Introduce();
        player3.Introduce();
    }
}
```

**Try this yourself:**
1. Create this script and attach it to a GameObject
2. Press Play and watch the Console
3. Create a fourth player with your name
4. Try giving players different amounts of damage and healing

## Real Game Example - Weapon System

Let's create a weapon system that you could actually use in a game:

```csharp
using UnityEngine;

// Weapon class - blueprint for all weapons
public class Weapon
{
    public string weaponName;
    public int damage;
    public float range;
    public float attackSpeed;  // Attacks per second
    public int durability;
    public int maxDurability;
    
    // Constructor
    public Weapon(string name, int damage, float range, float speed, int durability)
    {
        this.weaponName = name;
        this.damage = damage;
        this.range = range;
        this.attackSpeed = speed;
        this.durability = durability;
        this.maxDurability = durability;
    }
    
    public void ShowInfo()
    {
        Debug.Log($"=== {weaponName} ===");
        Debug.Log($"Damage: {damage}");
        Debug.Log($"Range: {range}");
        Debug.Log($"Attack Speed: {attackSpeed}");
        Debug.Log($"Durability: {durability}/{maxDurability}");
    }
    
    public int Attack()
    {
        if (durability <= 0)
        {
            Debug.Log($"{weaponName} is broken and can't attack!");
            return 0;
        }
        
        durability--;
        Debug.Log($"{weaponName} attacks for {damage} damage! Durability: {durability}");
        
        if (durability <= 0)
        {
            Debug.Log($"{weaponName} broke from use!");
        }
        
        return damage;
    }
    
    public void Repair(int repairAmount)
    {
        durability += repairAmount;
        if (durability > maxDurability)
        {
            durability = maxDurability;
        }
        Debug.Log($"{weaponName} repaired! Durability: {durability}/{maxDurability}");
    }
    
    public bool IsBroken()
    {
        return durability <= 0;
    }
}

// Script to test weapons
public class WeaponTester : MonoBehaviour
{
    void Start()
    {
        // Create different weapons
        Weapon sword = new Weapon("Iron Sword", 25, 1.5f, 1.2f, 50);
        Weapon bow = new Weapon("Wooden Bow", 18, 8.0f, 0.8f, 30);
        Weapon hammer = new Weapon("War Hammer", 40, 1.0f, 0.6f, 80);
        
        // Show their stats
        sword.ShowInfo();
        Debug.Log("");
        bow.ShowInfo();
        Debug.Log("");
        hammer.ShowInfo();
        Debug.Log("");
        
        // Use the sword a bunch of times
        Debug.Log("=== SWORD COMBAT ===");
        for (int i = 0; i < 10; i++)
        {
            if (!sword.IsBroken())
            {
                sword.Attack();
            }
        }
        
        // Try to repair it
        sword.Repair(20);
        sword.Attack();
    }
}
```

## Encapsulation - Keeping Things Private

Sometimes you want to protect your data from being changed incorrectly. This is called "encapsulation":

```csharp
using UnityEngine;

public class ProtectedPlayer
{
    // Private variables - only this class can change them directly
    private string playerName;
    private int health;
    private int maxHealth;
    private int level;
    
    // Public properties - controlled ways to access private data
    public string Name 
    { 
        get { return playerName; } 
        set 
        { 
            if (!string.IsNullOrEmpty(value))
            {
                playerName = value;
            }
        }
    }
    
    public int Health 
    { 
        get { return health; } 
        // No set - can't change health directly!
    }
    
    public int MaxHealth 
    { 
        get { return maxHealth; }
    }
    
    public int Level 
    { 
        get { return level; }
    }
    
    // Constructor
    public ProtectedPlayer(string name)
    {
        Name = name;  // Uses the property, which validates the name
        level = 1;
        maxHealth = 100;
        health = maxHealth;
    }
    
    // Controlled ways to change health
    public void TakeDamage(int damage)
    {
        if (damage < 0)
        {
            Debug.Log("Damage can't be negative!");
            return;
        }
        
        health -= damage;
        if (health < 0) health = 0;
        
        Debug.Log($"{Name} took {damage} damage! Health: {health}/{maxHealth}");
        
        if (health == 0)
        {
            Debug.Log($"{Name} has died!");
        }
    }
    
    public void Heal(int healAmount)
    {
        if (healAmount < 0)
        {
            Debug.Log("Heal amount can't be negative!");
            return;
        }
        
        if (health == 0)
        {
            Debug.Log($"{Name} is dead and can't be healed!");
            return;
        }
        
        health += healAmount;
        if (health > maxHealth) health = maxHealth;
        
        Debug.Log($"{Name} healed {healAmount}! Health: {health}/{maxHealth}");
    }
    
    public void LevelUp()
    {
        level++;
        maxHealth += 10;  // Get stronger each level
        health = maxHealth;  // Full heal
        
        Debug.Log($"{Name} leveled up to level {level}! Max health is now {maxHealth}!");
    }
    
    public bool IsAlive()
    {
        return health > 0;
    }
    
    public void ShowStats()
    {
        Debug.Log($"{Name} - Level {level} - Health: {health}/{maxHealth}");
    }
}

public class ProtectedPlayerTester : MonoBehaviour
{
    void Start()
    {
        ProtectedPlayer player = new ProtectedPlayer("Hero");
        
        player.ShowStats();
        
        // This works - using proper methods
        player.TakeDamage(30);
        player.Heal(15);
        player.LevelUp();
        
        // This would cause an error - we can't directly change private variables:
        // player.health = 500;  // Error! Can't access private field
        
        // But we can read public properties:
        Debug.Log($"Player's name is: {player.Name}");
        Debug.Log($"Player's health is: {player.Health}");
        
        player.ShowStats();
    }
}
```

## Inheritance - Building on Existing Classes

Inheritance lets you create new classes based on existing ones. It's like saying "make a new class that's like this old one, but with some changes":

```csharp
using UnityEngine;

// Base class - the foundation
public class Character
{
    protected string name;  // Protected = child classes can access it
    protected int health;
    protected int maxHealth;
    protected int level;
    
    public string Name { get { return name; } }
    public int Health { get { return health; } }
    public int Level { get { return level; } }
    
    public Character(string characterName, int startingHealth)
    {
        name = characterName;
        maxHealth = startingHealth;
        health = maxHealth;
        level = 1;
    }
    
    public virtual void TakeDamage(int damage)  // Virtual = can be overridden
    {
        health -= damage;
        if (health < 0) health = 0;
        Debug.Log($"{name} took {damage} damage! Health: {health}");
    }
    
    public virtual void Attack()
    {
        Debug.Log($"{name} attacks!");
    }
    
    public virtual void ShowInfo()
    {
        Debug.Log($"{name} - Level {level} - Health: {health}/{maxHealth}");
    }
}

// Warrior class - inherits from Character
public class Warrior : Character
{
    private int armor;
    private string weaponType;
    
    // Constructor - calls the parent constructor
    public Warrior(string name, string weapon) : base(name, 120)  // base() calls Character constructor
    {
        weaponType = weapon;
        armor = 10;
    }
    
    // Override the parent's TakeDamage method
    public override void TakeDamage(int damage)
    {
        int reducedDamage = damage - armor;
        if (reducedDamage < 1) reducedDamage = 1;  // Always take at least 1 damage
        
        Debug.Log($"{name}'s armor blocks {damage - reducedDamage} damage!");
        base.TakeDamage(reducedDamage);  // Call the parent method
    }
    
    public override void Attack()
    {
        Debug.Log($"{name} swings their {weaponType} powerfully!");
    }
    
    public override void ShowInfo()
    {
        base.ShowInfo();  // Show basic info
        Debug.Log($"Weapon: {weaponType}, Armor: {armor}");
    }
}

// Mage class - also inherits from Character
public class Mage : Character
{
    private int mana;
    private int maxMana;
    private string spellType;
    
    public int Mana { get { return mana; } }
    
    public Mage(string name, string spell) : base(name, 80)  // Mages have less health
    {
        spellType = spell;
        maxMana = 100;
        mana = maxMana;
    }
    
    public override void Attack()
    {
        if (mana >= 20)
        {
            mana -= 20;
            Debug.Log($"{name} casts {spellType}! Mana: {mana}/{maxMana}");
        }
        else
        {
            Debug.Log($"{name} doesn't have enough mana to cast spells!");
        }
    }
    
    public void RestoreMana(int amount)
    {
        mana += amount;
        if (mana > maxMana) mana = maxMana;
        Debug.Log($"{name} restored {amount} mana! Mana: {mana}/{maxMana}");
    }
    
    public override void ShowInfo()
    {
        base.ShowInfo();
        Debug.log($"Spell: {spellType}, Mana: {mana}/{maxMana}");
    }
}

// Rogue class - fast and sneaky
public class Rogue : Character
{
    private int stealth;
    private bool isHidden;
    
    public Rogue(string name) : base(name, 90)
    {
        stealth = 15;
        isHidden = false;
    }
    
    public void Hide()
    {
        isHidden = true;
        Debug.Log($"{name} hides in the shadows!");
    }
    
    public override void Attack()
    {
        if (isHidden)
        {
            Debug.Log($"{name} attacks from the shadows for extra damage!");
            isHidden = false;  // Attacking reveals you
        }
        else
        {
            Debug.Log($"{name} attacks quickly with daggers!");
        }
    }
    
    public override void TakeDamage(int damage)
    {
        if (isHidden)
        {
            Debug.Log($"{name} avoids the attack while hidden!");
            return;  // No damage while hidden
        }
        
        base.TakeDamage(damage);
    }
    
    public override void ShowInfo()
    {
        base.ShowInfo();
        Debug.Log($"Stealth: {stealth}, Hidden: {isHidden}");
    }
}

// Test all the character types
public class CharacterTester : MonoBehaviour
{
    void Start()
    {
        // Create different character types
        Warrior knight = new Warrior("Sir Galahad", "Holy Sword");
        Mage wizard = new Mage("Gandalf", "Fireball");
        Rogue thief = new Rogue("Sneaky Pete");
        
        Debug.Log("=== CHARACTER INFO ===");
        knight.ShowInfo();
        wizard.ShowInfo();
        thief.ShowInfo();
        
        Debug.Log("\n=== COMBAT TEST ===");
        
        // Everyone attacks
        knight.Attack();
        wizard.Attack();
        thief.Attack();
        
        Debug.Log("\n=== DAMAGE TEST ===");
        
        // Everyone takes the same damage
        knight.TakeDamage(25);  // Armor will reduce this
        wizard.TakeDamage(25);  // Full damage
        thief.TakeDamage(25);   // Full damage
        
        Debug.Log("\n=== SPECIAL ABILITIES ===");
        
        // Test special abilities
        thief.Hide();
        thief.TakeDamage(30);  // Should avoid this
        thief.Attack();        // Sneak attack
        
        wizard.RestoreMana(50);
        wizard.Attack();       // Should have enough mana now
    }
}
```

## Interfaces - Contracts for Classes

Interfaces are like contracts that say "any class that uses this interface MUST have these methods":

```csharp
using UnityEngine;

// Interface - defines what methods a class must have
public interface IDamageable
{
    void TakeDamage(int damage);
    bool IsAlive();
}

public interface IHealable
{
    void Heal(int healAmount);
    int GetCurrentHealth();
}

public interface IInteractable
{
    void Interact();
    string GetInteractionText();
}

// A treasure chest that can be interacted with
public class TreasureChest : IInteractable
{
    private bool isOpened = false;
    private string contents = "Gold Coins";
    
    public void Interact()
    {
        if (isOpened)
        {
            Debug.Log("The chest is already empty.");
        }
        else
        {
            Debug.Log($"You opened the chest and found: {contents}!");
            isOpened = true;
        }
    }
    
    public string GetInteractionText()
    {
        return isOpened ? "Empty Chest" : "Treasure Chest (Press E to open)";
    }
}

// A door that can be interacted with
public class Door : IInteractable
{
    private bool isOpen = false;
    private bool isLocked = false;
    
    public Door(bool locked = false)
    {
        isLocked = locked;
    }
    
    public void Interact()
    {
        if (isLocked)
        {
            Debug.Log("The door is locked!");
            return;
        }
        
        isOpen = !isOpen;  // Toggle open/closed
        Debug.Log(isOpen ? "You opened the door." : "You closed the door.");
    }
    
    public string GetInteractionText()
    {
        if (isLocked) return "Locked Door";
        return isOpen ? "Open Door (Press E to close)" : "Closed Door (Press E to open)";
    }
    
    public void Unlock()
    {
        isLocked = false;
        Debug.Log("The door is now unlocked!");
    }
}

// A simple NPC that implements multiple interfaces
public class SimpleNPC : IDamageable, IHealable, IInteractable
{
    private string npcName;
    private int health;
    private int maxHealth;
    private string dialogue;
    
    public SimpleNPC(string name, int startHealth, string whatTheySay)
    {
        npcName = name;
        maxHealth = startHealth;
        health = maxHealth;
        dialogue = whatTheySay;
    }
    
    // IDamageable implementation
    public void TakeDamage(int damage)
    {
        health -= damage;
        if (health < 0) health = 0;
        Debug.Log($"{npcName} took {damage} damage! Health: {health}");
        
        if (!IsAlive())
        {
            Debug.Log($"{npcName} has been defeated!");
        }
    }
    
    public bool IsAlive()
    {
        return health > 0;
    }
    
    // IHealable implementation
    public void Heal(int healAmount)
    {
        if (!IsAlive())
        {
            Debug.Log($"{npcName} is defeated and cannot be healed!");
            return;
        }
        
        health += healAmount;
        if (health > maxHealth) health = maxHealth;
        Debug.Log($"{npcName} was healed for {healAmount}! Health: {health}");
    }
    
    public int GetCurrentHealth()
    {
        return health;
    }
    
    // IInteractable implementation
    public void Interact()
    {
        if (!IsAlive())
        {
            Debug.Log($"{npcName} doesn't respond...");
            return;
        }
        
        Debug.Log($"{npcName}: {dialogue}");
    }
    
    public string GetInteractionText()
    {
        return IsAlive() ? $"Talk to {npcName}" : $"{npcName} (Defeated)";
    }
}

// Test the interface system
public class InterfaceTester : MonoBehaviour
{
    void Start()
    {
        // Create objects that implement interfaces
        TreasureChest chest = new TreasureChest();
        Door frontDoor = new Door(false);  // Unlocked
        Door lockedDoor = new Door(true);  // Locked
        SimpleNPC shopkeeper = new SimpleNPC("Bob", 50, "Welcome to my shop!");
        
        Debug.Log("=== INTERFACE TESTING ===");
        
        // Test interactables
        TestInteractable(chest);
        TestInteractable(frontDoor);
        TestInteractable(lockedDoor);
        TestInteractable(shopkeeper);
        
        Debug.Log("\n=== DAMAGE TESTING ===");
        
        // Test damageable (only NPC implements this)
        TestDamageable(shopkeeper);
        
        Debug.Log("\n=== HEALING TESTING ===");
        
        // Test healable (only NPC implements this)
        TestHealable(shopkeeper);
    }
    
    // This method works with ANY class that implements IInteractable
    void TestInteractable(IInteractable obj)
    {
        Debug.Log(obj.GetInteractionText());
        obj.Interact();
    }
    
    // This method works with ANY class that implements IDamageable
    void TestDamageable(IDamageable obj)
    {
        Debug.Log($"Is alive: {obj.IsAlive()}");
        obj.TakeDamage(30);
        Debug.Log($"Is alive after damage: {obj.IsAlive()}");
    }
    
    // This method works with ANY class that implements IHealable
    void TestHealable(IHealable obj)
    {
        Debug.Log($"Current health: {obj.GetCurrentHealth()}");
        obj.Heal(20);
        Debug.Log($"Health after healing: {obj.GetCurrentHealth()}");
    }
}
```

## Putting It All Together - Simple RPG System

Let's create a simple RPG system that uses everything we've learned:

```csharp
using UnityEngine;
using System.Collections.Generic;

// Base item class
public class Item
{
    public string name;
    public string description;
    public int value;
    
    public Item(string itemName, string desc, int worth)
    {
        name = itemName;
        description = desc;
        value = worth;
    }
    
    public virtual void Use()
    {
        Debug.Log($"You used {name}");
    }
    
    public virtual string GetInfo()
    {
        return $"{name}: {description} (Worth: {value} gold)";
    }
}

// Health potion class
public class HealthPotion : Item
{
    public int healAmount;
    
    public HealthPotion(int healing) : base("Health Potion", "Restores health", 50)
    {
        healAmount = healing;
    }
    
    public override void Use()
    {
        Debug.Log($"You drink the health potion and restore {healAmount} health!");
    }
    
    public override string GetInfo()
    {
        return base.GetInfo() + $" (Heals: {healAmount})";
    }
}

// Simple inventory system
public class Inventory
{
    private List<Item> items = new List<Item>();
    private int maxItems = 10;
    
    public bool AddItem(Item item)
    {
        if (items.Count >= maxItems)
        {
            Debug.Log("Inventory is full!");
            return false;
        }
        
        items.Add(item);
        Debug.Log($"Added {item.name} to inventory");
        return true;
    }
    
    public bool RemoveItem(Item item)
    {
        if (items.Remove(item))
        {
            Debug.Log($"Removed {item.name} from inventory");
            return true;
        }
        
        Debug.Log($"{item.name} not found in inventory");
        return false;
    }
    
    public void ShowInventory()
    {
        Debug.Log("=== INVENTORY ===");
        if (items.Count == 0)
        {
            Debug.Log("Inventory is empty");
            return;
        }
        
        for (int i = 0; i < items.Count; i++)
        {
            Debug.Log($"{i + 1}. {items[i].GetInfo()}");
        }
    }
    
    public Item GetItem(int index)
    {
        if (index >= 0 && index < items.Count)
        {
            return items[index];
        }
        return null;
    }
    
    public int GetItemCount()
    {
        return items.Count;
    }
}

// Player class using everything
public class RPGPlayer : Character, IHealable
{
    private Inventory inventory;
    private int gold;
    
    public RPGPlayer(string name) : base(name, 100)
    {
        inventory = new Inventory();
        gold = 100;
        
        // Start with some basic items
        inventory.AddItem(new HealthPotion(30));
        inventory.AddItem(new Item("Iron Sword", "A sturdy sword", 150));
        inventory.AddItem(new Item("Shield", "Protects from damage", 100));
    }
    
    public void AddGold(int amount)
    {
        gold += amount;
        Debug.Log($"Gained {amount} gold! Total: {gold}");
    }
    
    public bool SpendGold(int amount)
    {
        if (gold >= amount)
        {
            gold -= amount;
            Debug.Log($"Spent {amount} gold! Remaining: {gold}");
            return true;
        }
        
        Debug.Log("Not enough gold!");
        return false;
    }
    
    public void UseItem(int inventorySlot)
    {
        Item item = inventory.GetItem(inventorySlot - 1);  // Convert to 0-based index
        if (item == null)
        {
            Debug.Log("No item in that slot!");
            return;
        }
        
        item.Use();
        
        // If it's a health potion, actually heal the player
        if (item is HealthPotion potion)
        {
            Heal(potion.healAmount);
            inventory.RemoveItem(item);  // Remove the used potion
        }
    }
    
    // IHealable implementation
    public void Heal(int healAmount)
    {
        health += healAmount;
        if (health > maxHealth) health = maxHealth;
        Debug.Log($"{name} healed for {healAmount}! Health: {health}/{maxHealth}");
    }
    
    public int GetCurrentHealth()
    {
        return health;
    }
    
    public void ShowFullStatus()
    {
        ShowInfo();
        Debug.Log($"Gold: {gold}");
        inventory.ShowInventory();
    }
    
    public Inventory GetInventory()
    {
        return inventory;
    }
}

// Test the complete system
public class RPGTester : MonoBehaviour
{
    private RPGPlayer player;
    
    void Start()
    {
        player = new RPGPlayer("Adventure Hero");
        Debug.Log("=== RPG SYSTEM TEST ===");
        player.ShowFullStatus();
        
        Debug.Log("\n=== USING ITEMS ===");
        player.TakeDamage(40);  // Take some damage first
        player.UseItem(1);      // Use health potion
        
        Debug.Log("\n=== FINAL STATUS ===");
        player.ShowFullStatus();
    }
    
    void Update()
    {
        // Press keys to interact with the system
        if (Input.GetKeyDown(KeyCode.I))
        {
            player.ShowFullStatus();
        }
        
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            player.UseItem(1);
        }
        
        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            player.UseItem(2);
        }
        
        if (Input.GetKeyDown(KeyCode.H))
        {
            player.TakeDamage(20);  // Test damage
        }
        
        if (Input.GetKeyDown(KeyCode.G))
        {
            player.AddGold(50);  // Test gold
        }
    }
}
```

**Try this yourself:**
1. Press I to show inventory and status
2. Press 1 or 2 to use items from inventory
3. Press H to take damage (for testing)
4. Press G to gain gold

## Practice Exercises

Try creating these on your own:

1. **Animal System**: Create a base `Animal` class and make `Dog`, `Cat`, and `Bird` classes that inherit from it. Each should make their own sound.

2. **Vehicle System**: Create a `Vehicle` base class and make `Car`, `Bike`, and `Plane` classes. Each should have different ways of moving.

3. **Weapon Upgrade System**: Extend the weapon class to have upgrade levels that increase damage and change the weapon name.

4. **Shop System**: Create a `Shop` class that can sell items to the player using their gold.

5. **Quest System**: Create a `Quest` class with different types of quests (kill enemies, collect items, etc.).

## Key Takeaways

- **Classes** are blueprints, **Objects** are things made from those blueprints
- **Encapsulation** protects data by making it private and providing controlled access
- **Inheritance** lets you create new classes based on existing ones
- **Interfaces** define contracts that classes must follow
- **Constructors** run when you create new objects
- Use `public` for things others can access, `private` for internal stuff, `protected` for child classes
- `virtual` methods can be overridden by child classes
- `override` replaces a parent method with a new version

## In the Next Section

Next, we'll learn about **C# Advanced Concepts** like delegates, events, LINQ, and async programming - powerful tools that will make your code even more flexible and efficient!