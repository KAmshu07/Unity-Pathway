# Methods and Functions

## Introduction

Think of methods (also called functions) as mini-programs inside your main program. Just like you might have a recipe for making cookies that you can use whenever you want cookies, methods are recipes for doing specific tasks in your game. Instead of writing the same code over and over, you create a method once and use it whenever you need it!

## What Are Methods?

A method is a block of code that does one specific job. When you want that job done, you "call" the method by writing its name.

### Your First Method

```csharp
using UnityEngine;

public class FirstMethods : MonoBehaviour
{
    void Start()
    {
        // Calling methods - just write their name with ()
        SayHello();
        SayHello();  // You can call it as many times as you want!
        SayGoodbye();
    }
    
    // This is a method definition
    void SayHello()
    {
        Debug.Log("Hello, player!");
        Debug.Log("Welcome to the game!");
    }
    
    void SayGoodbye()
    {
        Debug.Log("Thanks for playing!");
        Debug.Log("See you next time!");
    }
}
```

**What happens:**
1. `Start()` runs when the game begins
2. It calls `SayHello()` twice
3. Then it calls `SayGoodbye()` once
4. Each method does its job when called

**Try this yourself:**
1. Add a new method called `ShowInstructions()` that prints game instructions
2. Call it from `Start()`
3. Create a method called `CountToFive()` that counts from 1 to 5

## Methods That Do Calculations

Some methods can give you answers - these are called "return" methods:

```csharp
using UnityEngine;

public class CalculationMethods : MonoBehaviour
{
    void Start()
    {
        // Methods that return values
        int result = AddTwoNumbers();
        Debug.Log("2 + 3 = " + result);
        
        float distance = GetDistanceToTarget();
        Debug.Log("Distance to target: " + distance);
        
        string greeting = CreateGreeting();
        Debug.Log(greeting);
        
        bool canPlay = IsPlayerReady();
        if (canPlay)
        {
            Debug.Log("Let's start the game!");
        }
    }
    
    // Method that returns a number
    int AddTwoNumbers()
    {
        int a = 2;
        int b = 3;
        int answer = a + b;
        return answer;  // Sends the answer back
    }
    
    // Method that returns a decimal number
    float GetDistanceToTarget()
    {
        Vector3 playerPos = new Vector3(0, 0, 0);
        Vector3 targetPos = new Vector3(5, 0, 3);
        float distance = Vector3.Distance(playerPos, targetPos);
        return distance;
    }
    
    // Method that returns text
    string CreateGreeting()
    {
        return "Welcome, brave adventurer!";
    }
    
    // Method that returns true/false
    bool IsPlayerReady()
    {
        // Let's say player is ready if it's not too early
        return Time.time > 1f;  // After 1 second
    }
}
```

**Try this yourself:**
1. Create a method called `MultiplyNumbers()` that multiplies 4 × 5 and returns the result
2. Make a method called `GetRandomNumber()` that returns a random number between 1 and 10
3. Create a method called `IsHealthLow()` that returns true if health is below 25

## Methods with Inputs (Parameters)

The really powerful part is giving methods information to work with:

```csharp
using UnityEngine;

public class MethodParameters : MonoBehaviour
{
    public int playerHealth = 100;
    public int playerLevel = 1;
    
    void Start()
    {
        // Giving methods information to work with
        SayHelloTo("Alex");
        SayHelloTo("Jordan");
        
        int sum = AddNumbers(10, 25);
        Debug.Log("10 + 25 = " + sum);
        
        int product = MultiplyNumbers(7, 8);
        Debug.Log("7 × 8 = " + product);
        
        // Using methods with our game variables
        HealPlayer(30);
        DamagePlayer(15);
        
        SetPlayerLevel(5);
    }
    
    // Method that takes text input
    void SayHelloTo(string name)
    {
        Debug.Log("Hello, " + name + "! Nice to meet you!");
    }
    
    // Method that takes two numbers and returns their sum
    int AddNumbers(int first, int second)
    {
        return first + second;
    }
    
    // Method that takes two numbers and returns their product
    int MultiplyNumbers(int a, int b)
    {
        int result = a * b;
        return result;
    }
    
    // Methods that modify our game variables
    void HealPlayer(int healAmount)
    {
        playerHealth += healAmount;
        if (playerHealth > 100)  // Don't go over 100
        {
            playerHealth = 100;
        }
        Debug.Log("Player healed! Health is now: " + playerHealth);
    }
    
    void DamagePlayer(int damage)
    {
        playerHealth -= damage;
        if (playerHealth < 0)  // Don't go below 0
        {
            playerHealth = 0;
        }
        Debug.Log("Player took damage! Health is now: " + playerHealth);
    }
    
    void SetPlayerLevel(int newLevel)
    {
        playerLevel = newLevel;
        Debug.Log("Player is now level " + playerLevel + "!");
    }
}
```

## Practical Game Methods

Let's create methods that do useful game tasks:

```csharp
using UnityEngine;

public class GameMethods : MonoBehaviour
{
    public float playerHealth = 100f;
    public float maxHealth = 100f;
    public int playerScore = 0;
    
    void Start()
    {
        Debug.Log("Game starting...");
        ShowPlayerStats();
    }
    
    void Update()
    {
        // Use methods to handle input
        if (Input.GetKeyDown(KeyCode.H))
        {
            UseHealthPotion();
        }
        
        if (Input.GetKeyDown(KeyCode.D))
        {
            TakeDamage(20f);
        }
        
        if (Input.GetKeyDown(KeyCode.S))
        {
            AddScore(100);
        }
        
        if (Input.GetKeyDown(KeyCode.I))
        {
            ShowPlayerStats();
        }
    }
    
    void UseHealthPotion()
    {
        Debug.Log("Using health potion...");
        
        if (IsHealthFull())
        {
            Debug.Log("Health is already full!");
            return;  // Exit the method early
        }
        
        HealPlayer(50f);
        Debug.Log("Health potion used!");
    }
    
    void TakeDamage(float damage)
    {
        Debug.Log($"Taking {damage} damage!");
        playerHealth -= damage;
        
        if (playerHealth <= 0)
        {
            playerHealth = 0;
            PlayerDied();
        }
        else
        {
            Debug.Log($"Health remaining: {playerHealth}");
        }
    }
    
    void HealPlayer(float healAmount)
    {
        playerHealth += healAmount;
        if (playerHealth > maxHealth)
        {
            playerHealth = maxHealth;
        }
        Debug.Log($"Healed {healAmount} points. Health: {playerHealth}");
    }
    
    void AddScore(int points)
    {
        playerScore += points;
        Debug.Log($"Score increased by {points}! Total score: {playerScore}");
        
        CheckForHighScore();
    }
    
    void CheckForHighScore()
    {
        if (playerScore >= 1000)
        {
            Debug.Log("HIGH SCORE ACHIEVED!");
        }
    }
    
    bool IsHealthFull()
    {
        return playerHealth >= maxHealth;
    }
    
    bool IsPlayerAlive()
    {
        return playerHealth > 0;
    }
    
    void PlayerDied()
    {
        Debug.Log("GAME OVER! Player has died!");
        // In a real game, you might restart the level here
    }
    
    void ShowPlayerStats()
    {
        Debug.Log("=== PLAYER STATS ===");
        Debug.Log($"Health: {playerHealth}/{maxHealth}");
        Debug.Log($"Score: {playerScore}");
        Debug.Log($"Status: {(IsPlayerAlive() ? "Alive" : "Dead")}");
    }
}
```

**Try this yourself:**
1. Press H to use a health potion
2. Press D to take damage
3. Press S to add score
4. Press I to show stats
5. Try taking enough damage to die

## Creating Multiple Versions of the Same Method

Sometimes you want the same method to work with different types of information:

```csharp
using UnityEngine;

public class MethodOverloading : MonoBehaviour
{
    void Start()
    {
        // Same method name, different inputs!
        MovePlayer(5f);                           // Move forward 5 units
        MovePlayer(3f, 2f);                       // Move to position (3, 2)
        MovePlayer(new Vector3(10, 0, 5));        // Move to exact position
        
        CreateEnemy("Goblin");                    // Default enemy
        CreateEnemy("Orc", 150);                  // Enemy with custom health
        CreateEnemy("Dragon", 500, 25);           // Enemy with health and damage
    }
    
    // Move forward
    void MovePlayer(float distance)
    {
        Vector3 newPos = transform.position + Vector3.forward * distance;
        transform.position = newPos;
        Debug.Log($"Moved forward {distance} units");
    }
    
    // Move to X, Z coordinates (Y stays the same)
    void MovePlayer(float x, float z)
    {
        Vector3 newPos = new Vector3(x, transform.position.y, z);
        transform.position = newPos;
        Debug.Log($"Moved to position ({x}, {z})");
    }
    
    // Move to exact position
    void MovePlayer(Vector3 targetPosition)
    {
        transform.position = targetPosition;
        Debug.Log($"Moved to exact position: {targetPosition}");
    }
    
    // Create enemy with default stats
    void CreateEnemy(string enemyType)
    {
        CreateEnemy(enemyType, 100, 10);  // Use defaults
    }
    
    // Create enemy with custom health
    void CreateEnemy(string enemyType, int health)
    {
        CreateEnemy(enemyType, health, 10);  // Default damage
    }
    
    // Create enemy with all custom stats
    void CreateEnemy(string enemyType, int health, int damage)
    {
        Debug.Log($"Created {enemyType} with {health} health and {damage} damage");
        // In a real game, you'd create the actual enemy object here
    }
}
```

## Optional Parameters - Making Life Easier

You can give parameters default values, so you don't always have to specify them:

```csharp
using UnityEngine;

public class OptionalParameters : MonoBehaviour
{
    void Start()
    {
        // These all work because we have default values!
        SpawnItem();                              // Uses all defaults
        SpawnItem("Sword");                       // Custom name, default position and count
        SpawnItem("Potion", new Vector3(5, 0, 3)); // Custom name and position
        SpawnItem("Gold", Vector3.zero, 5);       // All custom values
        
        PlaySound();                              // Default sound
        PlaySound("explosion");                   // Custom sound
        PlaySound("music", 0.5f);                 // Custom sound and volume
    }
    
    // Method with optional parameters (they have = default values)
    void SpawnItem(string itemName = "DefaultItem", Vector3 position = default(Vector3), int count = 1)
    {
        if (position == default(Vector3))
        {
            position = transform.position;  // Use current position if none specified
        }
        
        Debug.Log($"Spawning {count} {itemName}(s) at {position}");
    }
    
    void PlaySound(string soundName = "beep", float volume = 1.0f, bool loop = false)
    {
        Debug.Log($"Playing sound: {soundName} at volume {volume}" + 
                 (loop ? " (looping)" : ""));
        // In a real game, you'd play the actual sound here
    }
}
```

## Organizing Your Code with Methods

Methods help keep your code organized and easy to understand:

```csharp
using UnityEngine;

public class OrganizedPlayerController : MonoBehaviour
{
    [Header("Player Settings")]
    public float moveSpeed = 5f;
    public float jumpForce = 10f;
    public int maxHealth = 100;
    
    [Header("Current State")]
    public int currentHealth;
    public bool isGrounded = true;
    public bool canMove = true;
    
    void Start()
    {
        InitializePlayer();
    }
    
    void Update()
    {
        HandleInput();
        UpdatePlayer();
    }
    
    #region Initialization
    void InitializePlayer()
    {
        currentHealth = maxHealth;
        SetStartingPosition();
        ShowWelcomeMessage();
    }
    
    void SetStartingPosition()
    {
        transform.position = Vector3.zero;
    }
    
    void ShowWelcomeMessage()
    {
        Debug.Log("Player initialized and ready!");
    }
    #endregion
    
    #region Input Handling
    void HandleInput()
    {
        if (!canMove) return;
        
        HandleMovementInput();
        HandleActionInput();
    }
    
    void HandleMovementInput()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        if (horizontal != 0 || vertical != 0)
        {
            MovePlayer(horizontal, vertical);
        }
    }
    
    void HandleActionInput()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            TryJump();
        }
        
        if (Input.GetKeyDown(KeyCode.H))
        {
            TryHeal();
        }
    }
    #endregion
    
    #region Player Actions
    void MovePlayer(float horizontal, float vertical)
    {
        Vector3 movement = new Vector3(horizontal, 0, vertical);
        movement = movement.normalized * moveSpeed * Time.deltaTime;
        transform.Translate(movement);
    }
    
    void TryJump()
    {
        if (CanJump())
        {
            PerformJump();
        }
        else
        {
            Debug.Log("Can't jump right now!");
        }
    }
    
    bool CanJump()
    {
        return isGrounded && canMove && currentHealth > 0;
    }
    
    void PerformJump()
    {
        // In a real game, you'd add upward force to a Rigidbody
        Debug.Log("Player jumped!");
        isGrounded = false;
        
        // Simulate landing after a short time
        Invoke("Land", 1f);
    }
    
    void Land()
    {
        isGrounded = true;
        Debug.Log("Player landed!");
    }
    
    void TryHeal()
    {
        if (CanHeal())
        {
            HealPlayer(25);
        }
        else
        {
            Debug.Log("Can't heal right now!");
        }
    }
    
    bool CanHeal()
    {
        return currentHealth < maxHealth && currentHealth > 0;
    }
    
    void HealPlayer(int healAmount)
    {
        currentHealth += healAmount;
        if (currentHealth > maxHealth)
        {
            currentHealth = maxHealth;
        }
        Debug.Log($"Healed! Health: {currentHealth}/{maxHealth}");
    }
    #endregion
    
    #region Update Methods
    void UpdatePlayer()
    {
        CheckPlayerStatus();
    }
    
    void CheckPlayerStatus()
    {
        if (currentHealth <= 0)
        {
            HandlePlayerDeath();
        }
    }
    
    void HandlePlayerDeath()
    {
        canMove = false;
        Debug.Log("Player died! Game Over!");
    }
    #endregion
    
    #region Utility Methods
    public void TakeDamage(int damage)
    {
        currentHealth -= damage;
        Debug.Log($"Took {damage} damage! Health: {currentHealth}");
        
        if (currentHealth <= 0)
        {
            currentHealth = 0;
        }
    }
    
    public void ResetPlayer()
    {
        InitializePlayer();
        canMove = true;
        Debug.Log("Player reset!");
    }
    #endregion
}
```

**Try this yourself:**
1. Use WASD to move
2. Press Space to jump
3. Press H to heal
4. In the Inspector, try changing the settings
5. Add a new method for something you want the player to do

## Simple Combat System Example

Let's put it all together in a simple combat system:

```csharp
using UnityEngine;

public class SimpleCombat : MonoBehaviour
{
    [Header("Player Stats")]
    public int playerHealth = 100;
    public int playerAttack = 25;
    
    [Header("Enemy Stats")]
    public int enemyHealth = 80;
    public int enemyAttack = 20;
    
    [Header("Game State")]
    public bool combatActive = false;
    
    void Start()
    {
        StartCombat();
    }
    
    void Update()
    {
        if (combatActive)
        {
            HandleCombatInput();
        }
    }
    
    void StartCombat()
    {
        combatActive = true;
        Debug.Log("=== COMBAT STARTED ===");
        ShowCombatStatus();
        ShowCombatOptions();
    }
    
    void HandleCombatInput()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            PlayerAttack();
        }
        else if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            PlayerDefend();
        }
        else if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            PlayerHeal();
        }
    }
    
    void PlayerAttack()
    {
        Debug.Log("--- Player attacks! ---");
        
        int damage = CalculateAttackDamage(playerAttack);
        DealDamageToEnemy(damage);
        
        if (IsEnemyAlive())
        {
            EnemyTurn();
        }
        else
        {
            PlayerWins();
        }
    }
    
    void PlayerDefend()
    {
        Debug.Log("--- Player defends! ---");
        Debug.Log("Player reduces incoming damage this turn!");
        
        // Enemy attacks with reduced damage
        EnemyAttackWithReduction(0.5f);  // 50% damage reduction
        
        if (IsPlayerAlive())
        {
            ShowCombatOptions();
        }
    }
    
    void PlayerHeal()
    {
        Debug.Log("--- Player heals! ---");
        
        int healAmount = 30;
        HealPlayer(healAmount);
        
        if (IsEnemyAlive())
        {
            EnemyTurn();
        }
    }
    
    int CalculateAttackDamage(int baseAttack)
    {
        // Add some randomness: ±25% damage
        float multiplier = Random.Range(0.75f, 1.25f);
        int damage = Mathf.RoundToInt(baseAttack * multiplier);
        return damage;
    }
    
    void DealDamageToEnemy(int damage)
    {
        enemyHealth -= damage;
        if (enemyHealth < 0) enemyHealth = 0;
        
        Debug.Log($"Enemy takes {damage} damage! Enemy health: {enemyHealth}");
    }
    
    void DealDamageToPlayer(int damage)
    {
        playerHealth -= damage;
        if (playerHealth < 0) playerHealth = 0;
        
        Debug.Log($"Player takes {damage} damage! Player health: {playerHealth}");
    }
    
    void HealPlayer(int healAmount)
    {
        playerHealth += healAmount;
        if (playerHealth > 100) playerHealth = 100;
        
        Debug.Log($"Player heals {healAmount} health! Player health: {playerHealth}");
    }
    
    void EnemyTurn()
    {
        if (!IsEnemyAlive()) return;
        
        Debug.Log("--- Enemy's turn! ---");
        
        int damage = CalculateAttackDamage(enemyAttack);
        DealDamageToPlayer(damage);
        
        if (IsPlayerAlive())
        {
            ShowCombatOptions();
        }
        else
        {
            PlayerLoses();
        }
    }
    
    void EnemyAttackWithReduction(float damageReduction)
    {
        Debug.Log("--- Enemy attacks (reduced damage)! ---");
        
        int baseDamage = CalculateAttackDamage(enemyAttack);
        int reducedDamage = Mathf.RoundToInt(baseDamage * damageReduction);
        DealDamageToPlayer(reducedDamage);
        
        if (IsPlayerAlive())
        {
            ShowCombatOptions();
        }
        else
        {
            PlayerLoses();
        }
    }
    
    bool IsPlayerAlive()
    {
        return playerHealth > 0;
    }
    
    bool IsEnemyAlive()
    {
        return enemyHealth > 0;
    }
    
    void ShowCombatStatus()
    {
        Debug.Log($"Player Health: {playerHealth} | Enemy Health: {enemyHealth}");
    }
    
    void ShowCombatOptions()
    {
        Debug.Log("\nWhat do you want to do?");
        Debug.Log("1. Attack");
        Debug.Log("2. Defend");
        Debug.Log("3. Heal");
        ShowCombatStatus();
    }
    
    void PlayerWins()
    {
        combatActive = false;
        Debug.Log("=== VICTORY! ===");
        Debug.Log("You defeated the enemy!");
    }
    
    void PlayerLoses()
    {
        combatActive = false;
        Debug.Log("=== DEFEAT! ===");
        Debug.Log("You were defeated... Game Over!");
    }
}
```

**Try this yourself:**
1. Press 1 to attack
2. Press 2 to defend (reduces damage)
3. Press 3 to heal
4. Try different strategies to win!

## Method Best Practices

### Good Method Names
```csharp
// Good names - you know what they do
void JumpPlayer() { }
bool IsHealthLow() { }
void SaveGameData() { }
int CalculateDamage() { }

// Bad names - confusing
void DoStuff() { }
void Method1() { }
void X() { }
```

### Keep Methods Simple
```csharp
// Good - each method does one thing
void CheckInput()
{
    if (Input.GetKeyDown(KeyCode.Space))
    {
        Jump();
    }
}

void Jump()
{
    if (CanJump())
    {
        PerformJump();
    }
}

// Not as good - doing too many things at once
void UpdatePlayer()
{
    // Input handling
    if (Input.GetKeyDown(KeyCode.Space)) { /* jump code */ }
    if (Input.GetAxis("Horizontal") != 0) { /* movement code */ }
    
    // Health checking
    if (health <= 0) { /* death code */ }
    
    // Animation
    // ... lots more code
}
```

## Practice Exercises

Try creating these methods on your own:

1. **Dice Roller**: Create a method called `RollDice()` that returns a random number between 1 and 6.

2. **Distance Calculator**: Make a method that takes two Vector3 positions and returns the distance between them.

3. **Name Generator**: Create a method that returns a random fantasy name from an array of names.

4. **Inventory Checker**: Make a method called `HasItem(string itemName)` that returns true if the player has that item.

5. **Level Calculator**: Create a method that takes experience points and returns what level the player should be.

## Key Takeaways

- Methods help you organize code and avoid repetition
- Use `void` for methods that do something
- Use `int`, `float`, `string`, `bool` etc. for methods that return values
- Parameters let you give methods information to work with
- You can have multiple methods with the same name if they take different parameters
- Optional parameters make methods more flexible
- Good method names make your code easier to understand

## In the Next Section

Next, we'll learn about **Object-Oriented Programming** - how to create your own custom types and organize your code like building blocks that can work together!