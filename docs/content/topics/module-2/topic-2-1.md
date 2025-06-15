# C# Language Fundamentals

## Introduction

Think of C# as the language you use to tell Unity what to do. Just like you use English to give instructions to a friend, you use C# to give instructions to your game. In this section, we'll learn the basic "words" and "grammar" of C# so you can start making your game objects move, react, and behave the way you want.

## What is C# and Why Do We Use It?

C# (pronounced "C-Sharp") is a programming language that Unity understands. When you write C# code and attach it to game objects, you're essentially giving those objects a brain - telling them how to think and what to do.

### Your First Script

Let's start with something simple. Create a new script in Unity and try this:

```csharp
using UnityEngine;

public class MyFirstScript : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Hello, Unity!");
    }
}
```

**What this does:** When the game starts, it prints "Hello, Unity!" in the Console window.

**Try this yourself:**
1. Create a new script called "MyFirstScript"
2. Copy the code above
3. Attach it to any GameObject
4. Press Play
5. Look at the Console window (Window > General > Console)

## Variables - Storing Information

Variables are like boxes where you store information. Each box has a label (the variable name) and contains some data.

### Numbers

```csharp
using UnityEngine;

public class NumberExample : MonoBehaviour
{
    // Different types of numbers
    int playerHealth = 100;           // Whole numbers (1, 2, 50, 999)
    float playerSpeed = 5.5f;         // Decimal numbers (5.5, 3.14, 0.25)
    
    void Start()
    {
        Debug.Log("Player health: " + playerHealth);
        Debug.Log("Player speed: " + playerSpeed);
        
        // You can change the values
        playerHealth = 75;
        playerSpeed = 3.2f;
        
        Debug.Log("New health: " + playerHealth);
        Debug.Log("New speed: " + playerSpeed);
    }
}
```

**Try this yourself:**
- Change the starting health to 50
- Change the speed to 10.0f
- Add a new variable for player level (use int)

### Text (Strings)

```csharp
using UnityEngine;

public class TextExample : MonoBehaviour
{
    string playerName = "Hero";
    string welcomeMessage = "Welcome to the game!";
    
    void Start()
    {
        Debug.Log("Player name: " + playerName);
        Debug.Log(welcomeMessage);
        
        // Combining text
        Debug.Log("Hello, " + playerName + "!");
        
        // Another way to combine text
        Debug.Log($"Hello, {playerName}! Ready to play?");
    }
}
```

### True/False (Booleans)

```csharp
using UnityEngine;

public class BooleanExample : MonoBehaviour
{
    bool isPlayerAlive = true;
    bool hasKey = false;
    bool gameIsRunning = true;
    
    void Start()
    {
        Debug.Log("Is player alive? " + isPlayerAlive);
        Debug.Log("Does player have key? " + hasKey);
        
        if (isPlayerAlive)
        {
            Debug.Log("Player is alive and can move!");
        }
        
        if (!hasKey)  // The ! means "not"
        {
            Debug.Log("Player needs to find a key");
        }
    }
}
```

### Unity-Specific Variables

```csharp
using UnityEngine;

public class UnityVariables : MonoBehaviour
{
    // Positions in 3D space
    Vector3 playerPosition = new Vector3(0, 0, 0);  // x, y, z coordinates
    Vector3 targetPosition = new Vector3(5, 0, 3);
    
    // Colors
    Color playerColor = Color.red;
    Color backgroundColor = new Color(0.2f, 0.5f, 0.8f);  // Custom color (R, G, B)
    
    void Start()
    {
        Debug.Log("Player starts at: " + playerPosition);
        Debug.Log("Target is at: " + targetPosition);
        
        // Move this object to the player position
        transform.position = playerPosition;
        
        // Change this object's color (if it has a Renderer)
        if (GetComponent<Renderer>() != null)
        {
            GetComponent<Renderer>().material.color = playerColor;
        }
    }
}
```

**Try this yourself:**
1. Create a Cube in your scene
2. Attach this script to it
3. Change the playerPosition values
4. Press Play and watch the cube move to that position

## Making Calculations

You can do math with your variables, just like a calculator:

```csharp
using UnityEngine;

public class MathExample : MonoBehaviour
{
    int playerHealth = 100;
    int damage = 25;
    float playerSpeed = 5.0f;
    
    void Start()
    {
        // Basic math
        int newHealth = playerHealth - damage;
        Debug.Log("Health after damage: " + newHealth);
        
        // Multiplication
        float doubleSpeed = playerSpeed * 2;
        Debug.Log("Double speed would be: " + doubleSpeed);
        
        // Division
        int halfDamage = damage / 2;
        Debug.Log("Half damage: " + halfDamage);
        
        // Adding
        int healedHealth = newHealth + 30;
        Debug.Log("Health after healing: " + healedHealth);
    }
}
```

### Useful Unity Math

```csharp
using UnityEngine;

public class UnityMathExample : MonoBehaviour
{
    void Start()
    {
        // Distance between two points
        Vector3 pointA = new Vector3(0, 0, 0);
        Vector3 pointB = new Vector3(3, 0, 4);
        float distance = Vector3.Distance(pointA, pointB);
        Debug.Log("Distance: " + distance);
        
        // Random numbers
        int randomNumber = Random.Range(1, 10);  // Random number between 1 and 9
        Debug.Log("Random number: " + randomNumber);
        
        float randomFloat = Random.Range(0f, 1f);  // Random decimal between 0 and 1
        Debug.Log("Random float: " + randomFloat);
        
        // Keeping numbers in bounds
        int health = 150;
        health = Mathf.Clamp(health, 0, 100);  // Keeps health between 0 and 100
        Debug.Log("Clamped health: " + health);  // Will show 100
    }
}
```

## Converting Between Types

Sometimes you need to change one type of data to another:

```csharp
using UnityEngine;

public class ConversionExample : MonoBehaviour
{
    void Start()
    {
        // Number to text
        int score = 1500;
        string scoreText = score.ToString();
        Debug.Log("Score as text: " + scoreText);
        
        // Text to number (if possible)
        string healthText = "75";
        int health = int.Parse(healthText);
        Debug.Log("Health as number: " + health);
        
        // Safe conversion (won't crash if it fails)
        string badText = "abc";
        if (int.TryParse(badText, out int result))
        {
            Debug.Log("Conversion worked: " + result);
        }
        else
        {
            Debug.Log("Conversion failed - not a number!");
        }
        
        // Decimal to whole number
        float speedFloat = 5.8f;
        int speedInt = (int)speedFloat;  // Becomes 5 (cuts off decimal)
        Debug.Log("Speed as int: " + speedInt);
    }
}
```

## Organizing Your Code

Use meaningful names for your variables so you remember what they do:

```csharp
using UnityEngine;

public class GoodNamingExample : MonoBehaviour
{
    // Good names - you know what these are for
    int playerHealth = 100;
    float movementSpeed = 5.0f;
    bool canJump = true;
    string playerName = "Hero";
    Vector3 spawnPoint = Vector3.zero;
    
    // Bad names - confusing!
    // int x = 100;          // What is x?
    // float s = 5.0f;       // What is s?
    // bool b = true;        // What is b?
    
    void Start()
    {
        Debug.Log($"{playerName} starts with {playerHealth} health");
        
        if (canJump)
        {
            Debug.Log("Player can jump!");
        }
    }
}
```

## Your First Interactive Script

Let's make something that actually responds to player input:

```csharp
using UnityEngine;

public class SimplePlayerController : MonoBehaviour
{
    // Settings you can change in the Inspector
    public float moveSpeed = 5.0f;
    public int maxHealth = 100;
    
    // Private variables (only this script can see them)
    private int currentHealth;
    private bool isMoving = false;
    
    void Start()
    {
        // Set starting health
        currentHealth = maxHealth;
        Debug.Log("Player is ready! Health: " + currentHealth);
    }
    
    void Update()  // This runs every frame
    {
        // Check for movement input
        CheckMovement();
        
        // Check for heal input
        if (Input.GetKeyDown(KeyCode.H))
        {
            Heal(25);
        }
        
        // Check for damage input (for testing)
        if (Input.GetKeyDown(KeyCode.D))
        {
            TakeDamage(10);
        }
    }
    
    void CheckMovement()
    {
        float horizontal = Input.GetAxis("Horizontal");  // A/D or Arrow keys
        float vertical = Input.GetAxis("Vertical");      // W/S or Arrow keys
        
        if (horizontal != 0 || vertical != 0)
        {
            isMoving = true;
            // Move the object
            Vector3 movement = new Vector3(horizontal, 0, vertical);
            transform.Translate(movement * moveSpeed * Time.deltaTime);
        }
        else
        {
            isMoving = false;
        }
    }
    
    void Heal(int healAmount)
    {
        currentHealth += healAmount;
        
        // Don't go over max health
        if (currentHealth > maxHealth)
        {
            currentHealth = maxHealth;
        }
        
        Debug.Log("Healed! Current health: " + currentHealth);
    }
    
    void TakeDamage(int damage)
    {
        currentHealth -= damage;
        
        // Don't go below 0
        if (currentHealth < 0)
        {
            currentHealth = 0;
        }
        
        Debug.Log("Took damage! Current health: " + currentHealth);
        
        if (currentHealth == 0)
        {
            Debug.Log("Player died!");
        }
    }
}
```

**Try this yourself:**
1. Create a Cube or Capsule in your scene
2. Attach this script to it
3. Press Play
4. Use WASD or arrow keys to move
5. Press H to heal, D to take damage
6. Watch the Console for health updates

## Common Mistakes to Avoid

1. **Forgetting semicolons**: Every line needs to end with `;`
2. **Case sensitivity**: `playerhealth` is different from `playerHealth`
3. **Missing 'f' on floats**: Write `5.0f` not `5.0`
4. **Spelling mistakes**: `void Strat()` won't work - it should be `void Start()`

## Quick Reference

| Data Type | What it stores | Example |
|-----------|----------------|---------|
| `int` | Whole numbers | `int score = 100;` |
| `float` | Decimal numbers | `float speed = 5.5f;` |
| `string` | Text | `string name = "Player";` |
| `bool` | True/False | `bool isAlive = true;` |
| `Vector3` | 3D position/direction | `Vector3 pos = new Vector3(1, 2, 3);` |
| `Color` | Colors | `Color red = Color.red;` |

## Practice Exercises

Try these on your own:

1. **Health System**: Create a script that starts with 100 health, loses 20 health when you press the spacebar, and shows "Game Over" when health reaches 0.

2. **Color Changer**: Make a script that changes a cube's color to a random color every time you press the C key.

3. **Counter**: Create a script that counts up from 0 every second and displays the count in the Console.

## In the Next Section

Next, we'll learn about **Control Flow** - how to make decisions in your code and repeat actions. This will let you create more complex behaviors like "if the player has a key, open the door" or "keep moving until you reach the target."