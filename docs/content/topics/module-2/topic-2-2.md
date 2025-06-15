# Control Flow

## Introduction

Control Flow is like giving your game the ability to make decisions and repeat actions. Think of it like a flowchart - "if this happens, do that" or "keep doing this until something changes." This is what makes your games smart and interactive!

## Making Decisions with if/else

The `if` statement is like asking a question. If the answer is yes (true), do something. If the answer is no (false), do something else.

### Your First if Statement

```csharp
using UnityEngine;

public class SimpleDecisions : MonoBehaviour
{
    public int playerHealth = 100;
    
    void Start()
    {
        // Simple question: Is health greater than 50?
        if (playerHealth > 50)
        {
            Debug.Log("Player is healthy!");
        }
        
        // Let's try with different health values
        playerHealth = 30;
        
        if (playerHealth > 50)
        {
            Debug.Log("Player is healthy!");
        }
        else
        {
            Debug.Log("Player needs healing!");
        }
    }
}
```

**Try this yourself:**
1. Change the playerHealth to different numbers (10, 75, 100)
2. See how the message changes
3. Try changing 50 to other numbers

### Multiple Choices with else if

Sometimes you need more than just two choices:

```csharp
using UnityEngine;

public class HealthSystem : MonoBehaviour
{
    public int playerHealth = 100;
    
    void Start()
    {
        CheckPlayerStatus();
    }
    
    void Update()
    {
        // Press these keys to test different health levels
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            playerHealth = 100;
            CheckPlayerStatus();
        }
        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            playerHealth = 60;
            CheckPlayerStatus();
        }
        if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            playerHealth = 25;
            CheckPlayerStatus();
        }
        if (Input.GetKeyDown(KeyCode.Alpha4))
        {
            playerHealth = 0;
            CheckPlayerStatus();
        }
    }
    
    void CheckPlayerStatus()
    {
        Debug.Log("Current Health: " + playerHealth);
        
        if (playerHealth >= 80)
        {
            Debug.Log("Status: Excellent! You're in great shape!");
        }
        else if (playerHealth >= 50)
        {
            Debug.Log("Status: Good. You're doing fine.");
        }
        else if (playerHealth >= 20)
        {
            Debug.Log("Status: Warning! You need healing!");
        }
        else if (playerHealth > 0)
        {
            Debug.Log("Status: Critical! Find help immediately!");
        }
        else
        {
            Debug.Log("Status: Game Over!");
        }
    }
}
```

**Try this yourself:**
1. Press keys 1, 2, 3, 4 to test different health levels
2. Add a new health level (like 90) with its own message
3. Change the health thresholds to different numbers

### Combining Conditions

You can check multiple things at once:

```csharp
using UnityEngine;

public class DoorController : MonoBehaviour
{
    public bool hasKey = false;
    public int playerLevel = 1;
    public bool doorIsLocked = true;
    
    void Start()
    {
        TestDoorAccess();
    }
    
    void Update()
    {
        // Toggle key with K
        if (Input.GetKeyDown(KeyCode.K))
        {
            hasKey = !hasKey;  // Flip true/false
            Debug.Log("Key status: " + hasKey);
            TestDoorAccess();
        }
        
        // Change level with L
        if (Input.GetKeyDown(KeyCode.L))
        {
            playerLevel++;
            Debug.Log("Level up! Now level: " + playerLevel);
            TestDoorAccess();
        }
    }
    
    void TestDoorAccess()
    {
        Debug.Log("--- Testing Door Access ---");
        Debug.Log($"Has Key: {hasKey}, Level: {playerLevel}, Door Locked: {doorIsLocked}");
        
        // AND condition - both must be true
        if (hasKey && doorIsLocked)
        {
            Debug.Log("You can unlock the door with your key!");
        }
        
        // OR condition - at least one must be true
        if (hasKey || playerLevel >= 5)
        {
            Debug.Log("You can open the door! (Either you have a key OR you're high level)");
        }
        else
        {
            Debug.Log("Door remains closed. Need a key OR level 5+");
        }
        
        // Complex conditions
        if ((hasKey || playerLevel >= 10) && doorIsLocked)
        {
            Debug.Log("Special access granted!");
        }
    }
}
```

### The switch Statement - Multiple Exact Choices

When you have many specific choices, `switch` is cleaner than lots of `if-else`:

```csharp
using UnityEngine;

public class WeaponSystem : MonoBehaviour
{
    public int selectedWeapon = 1;
    
    void Start()
    {
        ShowWeaponInfo();
    }
    
    void Update()
    {
        // Press number keys to switch weapons
        if (Input.GetKeyDown(KeyCode.Alpha1)) { selectedWeapon = 1; ShowWeaponInfo(); }
        if (Input.GetKeyDown(KeyCode.Alpha2)) { selectedWeapon = 2; ShowWeaponInfo(); }
        if (Input.GetKeyDown(KeyCode.Alpha3)) { selectedWeapon = 3; ShowWeaponInfo(); }
        if (Input.GetKeyDown(KeyCode.Alpha4)) { selectedWeapon = 4; ShowWeaponInfo(); }
        if (Input.GetKeyDown(KeyCode.Alpha5)) { selectedWeapon = 5; ShowWeaponInfo(); }
    }
    
    void ShowWeaponInfo()
    {
        Debug.Log("Selected weapon: " + selectedWeapon);
        
        switch (selectedWeapon)
        {
            case 1:
                Debug.Log("Sword equipped! Damage: 25, Speed: Medium");
                break;  // Important! Stops here
                
            case 2:
                Debug.Log("Bow equipped! Damage: 15, Speed: Fast, Range: Long");
                break;
                
            case 3:
                Debug.Log("Hammer equipped! Damage: 40, Speed: Slow");
                break;
                
            case 4:
                Debug.Log("Magic Staff equipped! Damage: 30, Speed: Medium, Uses Mana");
                break;
                
            default:  // If none of the above match
                Debug.Log("No weapon equipped (or unknown weapon)");
                break;
        }
    }
}
```

## Repeating Actions with Loops

Loops let you do the same thing multiple times without writing the same code over and over.

### for Loop - When You Know How Many Times

Use `for` when you know exactly how many times you want to repeat something:

```csharp
using UnityEngine;

public class ForLoopExamples : MonoBehaviour
{
    void Start()
    {
        CountToTen();
        CreateEnemies();
        ShowInventory();
    }
    
    void CountToTen()
    {
        Debug.Log("--- Counting to 10 ---");
        
        // for (start; condition; increment)
        for (int i = 1; i <= 10; i++)
        {
            Debug.Log("Count: " + i);
        }
    }
    
    void CreateEnemies()
    {
        Debug.Log("--- Creating 5 enemies ---");
        
        for (int i = 0; i < 5; i++)
        {
            // Create enemy at different positions
            Vector3 position = new Vector3(i * 2, 0, 0);  // Space them out
            
            // In a real game, you'd use Instantiate here
            Debug.Log($"Enemy {i + 1} created at position {position}");
        }
    }
    
    void ShowInventory()
    {
        Debug.Log("--- Player Inventory ---");
        string[] items = {"Sword", "Health Potion", "Key", "Shield", "Magic Ring"};
        
        for (int i = 0; i < items.Length; i++)
        {
            Debug.Log($"Slot {i + 1}: {items[i]}");
        }
    }
}
```

### foreach Loop - For Collections

Use `foreach` when you want to go through every item in a list or array:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class ForeachExamples : MonoBehaviour
{
    public List<string> playerInventory = new List<string>();
    
    void Start()
    {
        // Add some items to inventory
        playerInventory.Add("Health Potion");
        playerInventory.Add("Sword");
        playerInventory.Add("Magic Ring");
        playerInventory.Add("Key");
        
        ShowAllItems();
        CountSpecialItems();
    }
    
    void ShowAllItems()
    {
        Debug.Log("--- Your Inventory ---");
        
        // foreach automatically goes through each item
        foreach (string item in playerInventory)
        {
            Debug.Log("You have: " + item);
        }
    }
    
    void CountSpecialItems()
    {
        int magicItems = 0;
        
        foreach (string item in playerInventory)
        {
            if (item.Contains("Magic") || item.Contains("Potion"))
            {
                magicItems++;
                Debug.Log($"Found magic item: {item}");
            }
        }
        
        Debug.Log($"Total magic items: {magicItems}");
    }
}
```

### while Loop - Keep Going Until Something Changes

Use `while` when you don't know exactly how many times, but you know when to stop:

```csharp
using UnityEngine;

public class WhileLoopExamples : MonoBehaviour
{
    public int playerHealth = 100;
    public int enemyCount = 15;
    
    void Start()
    {
        HealToFull();
        FightEnemies();
    }
    
    void HealToFull()
    {
        Debug.Log("--- Healing player ---");
        Debug.Log("Starting health: " + playerHealth);
        
        // Keep healing until health is 100
        while (playerHealth < 100)
        {
            playerHealth += 10;  // Heal 10 points
            Debug.Log("Healing... Health now: " + playerHealth);
            
            // Safety check - prevent infinite loops
            if (playerHealth > 200)  // Something went wrong!
            {
                Debug.Log("Error: Health too high, stopping healing");
                break;  // Exit the loop
            }
        }
        
        Debug.Log("Player fully healed!");
    }
    
    void FightEnemies()
    {
        Debug.Log("--- Fighting enemies ---");
        Debug.Log("Starting enemies: " + enemyCount);
        
        // Keep fighting while there are enemies AND we're alive
        while (enemyCount > 0 && playerHealth > 0)
        {
            // Fight one enemy
            enemyCount--;
            playerHealth -= 15;  // Take some damage
            
            Debug.Log($"Defeated an enemy! Enemies left: {enemyCount}, Health: {playerHealth}");
            
            // Maybe find a health potion sometimes
            if (Random.Range(0, 100) < 20)  // 20% chance
            {
                playerHealth += 25;
                Debug.Log("Found health potion! Health: " + playerHealth);
            }
        }
        
        if (playerHealth <= 0)
        {
            Debug.Log("Player defeated! Game Over!");
        }
        else
        {
            Debug.Log("All enemies defeated! Victory!");
        }
    }
}
```

## Controlling Loops with break and continue

Sometimes you need to exit a loop early or skip some iterations:

```csharp
using UnityEngine;

public class LoopControlExamples : MonoBehaviour
{
    void Start()
    {
        FindTreasure();
        ProcessItems();
    }
    
    void FindTreasure()
    {
        Debug.Log("--- Searching for treasure ---");
        
        for (int room = 1; room <= 10; room++)
        {
            Debug.Log($"Searching room {room}...");
            
            // 30% chance to find treasure
            if (Random.Range(0, 100) < 30)
            {
                Debug.Log($"TREASURE FOUND in room {room}!");
                break;  // Stop searching - we found it!
            }
            
            Debug.Log("No treasure here, moving to next room");
        }
    }
    
    void ProcessItems()
    {
        Debug.Log("--- Processing inventory ---");
        string[] items = {"Broken Sword", "Health Potion", "Damaged Shield", "Magic Ring", "Rusty Key"};
        
        foreach (string item in items)
        {
            Debug.Log($"Examining: {item}");
            
            // Skip broken/damaged items
            if (item.Contains("Broken") || item.Contains("Damaged") || item.Contains("Rusty"))
            {
                Debug.Log($"Skipping {item} - it's not useful");
                continue;  // Skip the rest of this loop iteration
            }
            
            // Process good items
            Debug.Log($"Processing {item} - this is useful!");
        }
    }
}
```

## Making Interactive Games

Let's combine everything to make a simple interactive game:

```csharp
using UnityEngine;

public class SimpleAdventureGame : MonoBehaviour
{
    // Player stats
    public int playerHealth = 100;
    public int playerGold = 0;
    public bool hasKey = false;
    
    // Game state
    public int currentRoom = 1;
    public bool gameRunning = true;
    
    void Start()
    {
        Debug.Log("=== WELCOME TO THE SIMPLE ADVENTURE ===");
        Debug.Log("Use number keys to make choices!");
        ShowRoomDescription();
    }
    
    void Update()
    {
        if (!gameRunning) return;  // Exit early if game is over
        
        // Handle player input
        HandleInput();
        
        // Check win/lose conditions
        CheckGameState();
    }
    
    void HandleInput()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            MakeChoice(1);
        }
        else if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            MakeChoice(2);
        }
        else if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            MakeChoice(3);
        }
    }
    
    void MakeChoice(int choice)
    {
        Debug.Log($"--- You chose option {choice} ---");
        
        switch (currentRoom)
        {
            case 1:  // Starting room
                if (choice == 1)
                {
                    Debug.Log("You search the room and find 10 gold!");
                    playerGold += 10;
                }
                else if (choice == 2)
                {
                    Debug.Log("You move to the next room.");
                    currentRoom = 2;
                }
                else if (choice == 3)
                {
                    Debug.Log("You rest and recover 20 health.");
                    playerHealth += 20;
                    if (playerHealth > 100) playerHealth = 100;
                }
                break;
                
            case 2:  // Monster room
                if (choice == 1)
                {
                    Debug.Log("You fight the monster!");
                    playerHealth -= 30;
                    if (playerHealth > 0)
                    {
                        Debug.Log("You win! Found a key!");
                        hasKey = true;
                        currentRoom = 3;
                    }
                }
                else if (choice == 2)
                {
                    Debug.Log("You run away back to the first room.");
                    currentRoom = 1;
                }
                break;
                
            case 3:  // Treasure room
                if (choice == 1 && hasKey)
                {
                    Debug.Log("You unlock the treasure chest and find 100 gold!");
                    playerGold += 100;
                    Debug.Log("YOU WIN! Total gold: " + playerGold);
                    gameRunning = false;
                }
                else if (choice == 1 && !hasKey)
                {
                    Debug.Log("The chest is locked. You need a key!");
                }
                else if (choice == 2)
                {
                    Debug.Log("You go back to fight more monsters.");
                    currentRoom = 2;
                }
                break;
        }
        
        if (gameRunning)
        {
            ShowRoomDescription();
        }
    }
    
    void ShowRoomDescription()
    {
        Debug.Log($"\n--- ROOM {currentRoom} ---");
        Debug.Log($"Health: {playerHealth} | Gold: {playerGold} | Has Key: {hasKey}");
        
        switch (currentRoom)
        {
            case 1:
                Debug.Log("You're in a small room with dusty furniture.");
                Debug.Log("1. Search the room");
                Debug.Log("2. Go to next room");
                Debug.Log("3. Rest");
                break;
                
            case 2:
                Debug.Log("A scary monster blocks your path!");
                Debug.Log("1. Fight the monster");
                Debug.Log("2. Run away");
                break;
                
            case 3:
                Debug.Log("You see a large treasure chest!");
                Debug.Log("1. Try to open the chest");
                Debug.Log("2. Go back");
                break;
        }
    }
    
    void CheckGameState()
    {
        if (playerHealth <= 0)
        {
            Debug.Log("GAME OVER! You died!");
            gameRunning = false;
        }
    }
}
```

**Try this yourself:**
1. Attach this script to any GameObject
2. Press Play
3. Use number keys 1, 2, 3 to make choices
4. Try different paths through the game
5. Modify the story - add new rooms, items, or choices!

## Common Patterns You'll Use

Here are some patterns you'll use constantly in game development:

```csharp
using UnityEngine;

public class CommonPatterns : MonoBehaviour
{
    public float timer = 0f;
    public int score = 0;
    
    void Update()
    {
        // Pattern 1: Timer
        timer += Time.deltaTime;
        if (timer >= 5f)  // Every 5 seconds
        {
            Debug.Log("5 seconds passed!");
            timer = 0f;  // Reset timer
        }
        
        // Pattern 2: Input checking
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Jump();
        }
        
        // Pattern 3: Boundary checking
        Vector3 pos = transform.position;
        if (pos.x > 10f)
        {
            pos.x = 10f;  // Don't go past boundary
            transform.position = pos;
        }
        
        // Pattern 4: State checking
        if (score >= 100 && score < 200)
        {
            Debug.Log("Good score range!");
        }
    }
    
    void Jump()
    {
        Debug.Log("Player jumped!");
    }
}
```

## Practice Exercises

Try these on your own:

1. **Traffic Light**: Create a script that cycles through Red (3 seconds), Yellow (1 second), Green (3 seconds) and changes a cube's color accordingly.

2. **Number Guessing Game**: Make the computer pick a random number 1-10. Let the player guess with number keys. Tell them if they're too high, too low, or correct.

3. **Inventory System**: Create a simple inventory that can hold 5 items. Let the player add items (press A) and remove items (press R). Show the inventory contents.

4. **Health Regeneration**: Make a player's health slowly regenerate over time, but only if they haven't taken damage recently.

## Key Takeaways

- `if/else` lets your game make decisions
- `switch` is good for exact choices (like weapon types)
- `for` loops are perfect when you know how many times
- `foreach` loops work great with lists and arrays
- `while` loops continue until a condition changes
- `break` exits a loop early
- `continue` skips to the next loop iteration

## In the Next Section

Next, we'll learn about **Methods and Functions** - how to organize your code into reusable chunks so you don't have to write the same thing over and over again!