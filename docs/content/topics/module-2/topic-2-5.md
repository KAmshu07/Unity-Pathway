# C# Advanced Concepts

## Introduction

Now that you understand the basics of C#, let's explore some advanced features that will make your Unity scripts more powerful and flexible. These concepts might seem complex at first, but they're incredibly useful for creating sophisticated game systems. Think of them as power tools that become essential once you know how to use them!

## Delegates and Events

Delegates are like "function pointers" - they can hold references to methods and call them later. Events are a special type of delegate that's perfect for game systems communicating with each other.

### Understanding Delegates

Think of a delegate as a messenger that can deliver different messages (call different methods) depending on what you tell it to do:

```csharp
using UnityEngine;
using System;

public class DelegateBasics : MonoBehaviour
{
    // Declare a delegate type - this is like creating a "shape" for methods
    public delegate void SimpleAction();
    public delegate void MessageAction(string message);
    public delegate int MathOperation(int a, int b);
    
    void Start()
    {
        // Create delegate instances and assign methods to them
        SimpleAction myAction = SayHello;
        myAction += SayGoodbye;  // You can add multiple methods!
        
        MessageAction messenger = ShowMessage;
        MathOperation calculator = AddNumbers;
        
        // Call the delegates
        Debug.Log("=== Calling Simple Action ===");
        myAction();  // Calls both SayHello AND SayGoodbye
        
        Debug.Log("\n=== Using Messenger ===");
        messenger("This is a custom message!");
        
        Debug.Log("\n=== Using Calculator ===");
        int result = calculator(5, 3);
        Debug.Log($"Calculation result: {result}");
        
        // You can change what the delegate points to
        calculator = MultiplyNumbers;
        result = calculator(5, 3);
        Debug.Log($"New calculation result: {result}");
    }
    
    void SayHello()
    {
        Debug.Log("Hello from delegate!");
    }
    
    void SayGoodbye()
    {
        Debug.Log("Goodbye from delegate!");
    }
    
    void ShowMessage(string msg)
    {
        Debug.Log($"Message: {msg}");
    }
    
    int AddNumbers(int x, int y)
    {
        return x + y;
    }
    
    int MultiplyNumbers(int x, int y)
    {
        return x * y;
    }
}
```

### Events - The Game Changer

Events are perfect for letting different parts of your game communicate without being directly connected:

```csharp
using UnityEngine;
using System;

public class GameEventSystem : MonoBehaviour
{
    // Events - other scripts can listen to these
    public static event Action OnGameStart;
    public static event Action OnGameEnd;
    public static event Action<int> OnScoreChanged;
    public static event Action<string> OnPlayerDied;
    
    private int currentScore = 0;
    
    void Start()
    {
        Debug.Log("Game Event System started");
        
        // Start the game after a short delay
        Invoke("StartGame", 1f);
    }
    
    void Update()
    {
        // Test inputs
        if (Input.GetKeyDown(KeyCode.Space))
        {
            AddScore(100);
        }
        
        if (Input.GetKeyDown(KeyCode.K))
        {
            KillPlayer();
        }
        
        if (Input.GetKeyDown(KeyCode.R))
        {
            EndGame();
        }
    }
    
    void StartGame()
    {
        Debug.Log("Starting game...");
        OnGameStart?.Invoke();  // The ? means "only call if someone is listening"
    }
    
    void AddScore(int points)
    {
        currentScore += points;
        Debug.Log($"Score increased by {points}! Total: {currentScore}");
        OnScoreChanged?.Invoke(currentScore);
    }
    
    void KillPlayer()
    {
        Debug.Log("Player died!");
        OnPlayerDied?.Invoke("Player was defeated");
    }
    
    void EndGame()
    {
        Debug.Log("Ending game...");
        OnGameEnd?.Invoke();
    }
}

// A UI system that listens to events
public class UIManager : MonoBehaviour
{
    void OnEnable()
    {
        // Subscribe to events
        GameEventSystem.OnGameStart += HandleGameStart;
        GameEventSystem.OnGameEnd += HandleGameEnd;
        GameEventSystem.OnScoreChanged += HandleScoreChange;
        GameEventSystem.OnPlayerDied += HandlePlayerDeath;
    }
    
    void OnDisable()
    {
        // Always unsubscribe to prevent errors!
        GameEventSystem.OnGameStart -= HandleGameStart;
        GameEventSystem.OnGameEnd -= HandleGameEnd;
        GameEventSystem.OnScoreChanged -= HandleScoreChange;
        GameEventSystem.OnPlayerDied -= HandlePlayerDeath;
    }
    
    void HandleGameStart()
    {
        Debug.Log("[UI] Game started - showing game UI");
    }
    
    void HandleGameEnd()
    {
        Debug.Log("[UI] Game ended - showing end screen");
    }
    
    void HandleScoreChange(int newScore)
    {
        Debug.Log($"[UI] Updating score display to: {newScore}");
    }
    
    void HandlePlayerDeath(string reason)
    {
        Debug.Log($"[UI] Showing death screen: {reason}");
    }
}

// An audio system that also listens to events
public class AudioManager : MonoBehaviour
{
    void OnEnable()
    {
        GameEventSystem.OnGameStart += PlayGameMusic;
        GameEventSystem.OnScoreChanged += PlayScoreSound;
        GameEventSystem.OnPlayerDied += PlayDeathSound;
    }
    
    void OnDisable()
    {
        GameEventSystem.OnGameStart -= PlayGameMusic;
        GameEventSystem.OnScoreChanged -= PlayScoreSound;
        GameEventSystem.OnPlayerDied -= PlayDeathSound;
    }
    
    void PlayGameMusic()
    {
        Debug.Log("[Audio] Playing background music");
    }
    
    void PlayScoreSound(int score)
    {
        Debug.Log("[Audio] Playing score increase sound");
    }
    
    void PlayDeathSound(string reason)
    {
        Debug.Log("[Audio] Playing death sound effect");
    }
}
```

**Try this yourself:**
1. Create all three scripts and attach them to different GameObjects
2. Press Space to increase score
3. Press K to kill player
4. Press R to end game
5. Notice how UI and Audio respond automatically!

## Lambda Expressions

Lambda expressions are a short way to write simple methods. They're especially useful with delegates and events:

```csharp
using UnityEngine;
using System;
using System.Collections.Generic;

public class LambdaExamples : MonoBehaviour
{
    void Start()
    {
        BasicLambdas();
        LambdasWithLists();
        LambdasWithDelegates();
    }
    
    void BasicLambdas()
    {
        Debug.Log("=== Basic Lambdas ===");
        
        // Traditional way to create a method
        Func<int, int, int> traditionalAdd = AddNumbers;
        
        // Lambda way - much shorter!
        Func<int, int, int> lambdaAdd = (x, y) => x + y;
        
        // Both do the same thing
        Debug.Log($"Traditional: {traditionalAdd(5, 3)}");
        Debug.Log($"Lambda: {lambdaAdd(5, 3)}");
        
        // More lambda examples
        Func<int, bool> isEven = x => x % 2 == 0;
        Func<string, string> addExclamation = text => text + "!";
        Action<string> printMessage = msg => Debug.Log($"Message: {msg}");
        
        Debug.Log($"Is 4 even? {isEven(4)}");
        Debug.Log($"Is 7 even? {isEven(7)}");
        Debug.Log($"With exclamation: {addExclamation("Hello World")}");
        printMessage("This is from a lambda");
    }
    
    void LambdasWithLists()
    {
        Debug.Log("\n=== Lambdas with Lists ===");
        
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        List<string> playerNames = new List<string> { "Alice", "Bob", "Charlie", "Diana" };
        
        // Find all even numbers
        var evenNumbers = numbers.FindAll(x => x % 2 == 0);
        Debug.Log("Even numbers: " + string.Join(", ", evenNumbers));
        
        // Find all names starting with specific letter
        var namesStartingWithC = playerNames.FindAll(name => name.StartsWith("C"));
        Debug.Log("Names starting with C: " + string.Join(", ", namesStartingWithC));
        
        // Check if any number is greater than 5
        bool hasLargeNumber = numbers.Exists(x => x > 5);
        Debug.Log($"Has number > 5: {hasLargeNumber}");
        
        // Transform all names to uppercase
        playerNames.ForEach(name => Debug.Log($"Player: {name.ToUpper()}"));
        
        // Find first number divisible by 3
        int firstDivisibleBy3 = numbers.Find(x => x % 3 == 0);
        Debug.Log($"First number divisible by 3: {firstDivisibleBy3}");
    }
    
    void LambdasWithDelegates()
    {
        Debug.Log("\n=== Lambdas with Delegates ===");
        
        // Instead of creating separate methods, use lambdas
        Action onPlayerSpawn = () => Debug.Log("Player spawned!");
        Action<int> onHealthChange = health => Debug.Log($"Health changed to: {health}");
        Func<float, float, float> calculateDistance = (x, z) => Mathf.Sqrt(x * x + z * z);
        
        // Call them
        onPlayerSpawn();
        onHealthChange(75);
        Debug.Log($"Distance: {calculateDistance(3, 4)}");
        
        // You can combine multiple lambdas
        Action multipleActions = () => Debug.Log("Action 1");
        multipleActions += () => Debug.Log("Action 2");
        multipleActions += () => Debug.Log("Action 3");
        
        multipleActions();  // Executes all three
    }
    
    // Traditional method for comparison
    int AddNumbers(int a, int b)
    {
        return a + b;
    }
}
```

## LINQ Basics

LINQ (Language Integrated Query) lets you search and manipulate collections of data easily. It's like having a super-powered search function:

```csharp
using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class LINQExamples : MonoBehaviour
{
    // Sample data
    public class Player
    {
        public string Name;
        public int Level;
        public int Score;
        public string Class;
        public bool IsOnline;
        
        public Player(string name, int level, int score, string playerClass, bool online)
        {
            Name = name;
            Level = level;
            Score = score;
            Class = playerClass;
            IsOnline = online;
        }
        
        public override string ToString()
        {
            return $"{Name} (Lv.{Level}, {Class}, Score: {Score}) {(IsOnline ? "Online" : "Offline")}";
        }
    }
    
    void Start()
    {
        // Create sample data
        List<Player> players = new List<Player>
        {
            new Player("Alice", 25, 1500, "Warrior", true),
            new Player("Bob", 18, 800, "Mage", false),
            new Player("Charlie", 32, 2200, "Rogue", true),
            new Player("Diana", 15, 600, "Warrior", true),
            new Player("Eve", 28, 1800, "Mage", false),
            new Player("Frank", 22, 1200, "Rogue", true)
        };
        
        BasicLINQOperations(players);
        AdvancedLINQOperations(players);
        PracticalGameExamples(players);
    }
    
    void BasicLINQOperations(List<Player> players)
    {
        Debug.Log("=== Basic LINQ Operations ===");
        
        // Find all online players
        var onlinePlayers = players.Where(p => p.IsOnline);
        Debug.Log("Online Players:");
        foreach (var player in onlinePlayers)
        {
            Debug.Log($"  {player}");
        }
        
        // Find players above level 20
        var highLevelPlayers = players.Where(p => p.Level > 20);
        Debug.Log("\nHigh Level Players (>20):");
        foreach (var player in highLevelPlayers)
        {
            Debug.Log($"  {player}");
        }
        
        // Get just the names of all warriors
        var warriorNames = players.Where(p => p.Class == "Warrior").Select(p => p.Name);
        Debug.Log($"\nWarrior Names: {string.Join(", ", warriorNames)}");
        
        // Sort by score (highest first)
        var sortedByScore = players.OrderByDescending(p => p.Score);
        Debug.Log("\nPlayers sorted by score:");
        foreach (var player in sortedByScore)
        {
            Debug.Log($"  {player}");
        }
    }
    
    void AdvancedLINQOperations(List<Player> players)
    {
        Debug.Log("\n=== Advanced LINQ Operations ===");
        
        // Group players by class
        var playersByClass = players.GroupBy(p => p.Class);
        Debug.Log("Players grouped by class:");
        foreach (var group in playersByClass)
        {
            Debug.Log($"  {group.Key}: {group.Count()} players");
            foreach (var player in group)
            {
                Debug.Log($"    {player.Name}");
            }
        }
        
        // Calculate statistics
        var averageLevel = players.Average(p => p.Level);
        var totalScore = players.Sum(p => p.Score);
        var highestLevel = players.Max(p => p.Level);
        var lowestScore = players.Min(p => p.Score);
        
        Debug.Log($"\nStatistics:");
        Debug.Log($"  Average Level: {averageLevel:F1}");
        Debug.Log($"  Total Score: {totalScore}");
        Debug.Log($"  Highest Level: {highestLevel}");
        Debug.Log($"  Lowest Score: {lowestScore}");
        
        // Complex queries
        var topOnlineWarriors = players
            .Where(p => p.IsOnline && p.Class == "Warrior")
            .OrderByDescending(p => p.Score)
            .Take(2);  // Take top 2
            
        Debug.Log("\nTop 2 online warriors:");
        foreach (var player in topOnlineWarriors)
        {
            Debug.Log($"  {player}");
        }
    }
    
    void PracticalGameExamples(List<Player> players)
    {
        Debug.Log("\n=== Practical Game Examples ===");
        
        // Find players eligible for a special event (level 20+, online)
        var eventEligible = players.Where(p => p.Level >= 20 && p.IsOnline);
        Debug.Log($"Players eligible for special event: {eventEligible.Count()}");
        
        // Create a leaderboard (top 3 scores)
        var leaderboard = players.OrderByDescending(p => p.Score).Take(3);
        Debug.Log("\nLeaderboard (Top 3):");
        int rank = 1;
        foreach (var player in leaderboard)
        {
            Debug.Log($"  {rank}. {player.Name} - {player.Score} points");
            rank++;
        }
        
        // Check if we have any low-level players who need help
        bool hasNewbies = players.Any(p => p.Level < 10);
        Debug.Log($"\nHas newbie players (level < 10): {hasNewbies}");
        
        // Find the most popular class
        var mostPopularClass = players.GroupBy(p => p.Class)
                                     .OrderByDescending(g => g.Count())
                                     .First();
        Debug.Log($"Most popular class: {mostPopularClass.Key} ({mostPopularClass.Count()} players)");
        
        // Calculate average score per class
        var avgScorePerClass = players.GroupBy(p => p.Class)
                                     .Select(g => new { Class = g.Key, AvgScore = g.Average(p => p.Score) });
        Debug.Log("\nAverage score per class:");
        foreach (var item in avgScorePerClass)
        {
            Debug.Log($"  {item.Class}: {item.AvgScore:F1}");
        }
    }
}
```

## Generics

Generics let you create classes and methods that work with different types. It's like creating a template that can be filled with any type you want:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class GenericExamples : MonoBehaviour
{
    void Start()
    {
        TestGenericContainer();
        TestGenericMethods();
        TestGameSpecificGenerics();
    }
    
    void TestGenericContainer()
    {
        Debug.Log("=== Generic Container Test ===");
        
        // Same container class, different types!
        SimpleContainer<int> numberContainer = new SimpleContainer<int>(42);
        SimpleContainer<string> textContainer = new SimpleContainer<string>("Hello World");
        SimpleContainer<Vector3> positionContainer = new SimpleContainer<Vector3>(new Vector3(1, 2, 3));
        
        Debug.Log($"Number: {numberContainer.GetValue()}");
        Debug.Log($"Text: {textContainer.GetValue()}");
        Debug.Log($"Position: {positionContainer.GetValue()}");
        
        // Change the values
        numberContainer.SetValue(100);
        textContainer.SetValue("Updated Text");
        
        Debug.Log($"Updated Number: {numberContainer.GetValue()}");
        Debug.Log($"Updated Text: {textContainer.GetValue()}");
    }
    
    void TestGenericMethods()
    {
        Debug.Log("\n=== Generic Methods Test ===");
        
        // Same method, different types!
        int[] numbers = {1, 2, 3, 4, 5};
        string[] words = {"apple", "banana", "cherry"};
        float[] decimals = {1.1f, 2.2f, 3.3f, 4.4f};
        
        PrintArray(numbers);
        PrintArray(words);
        PrintArray(decimals);
        
        // Swap values
        int a = 10, b = 20;
        Debug.Log($"Before swap: a={a}, b={b}");
        Swap(ref a, ref b);
        Debug.Log($"After swap: a={a}, b={b}");
        
        string x = "Hello", y = "World";
        Debug.Log($"Before swap: x={x}, y={y}");
        Swap(ref x, ref y);
        Debug.Log($"After swap: x={x}, y={y}");
    }
    
    void TestGameSpecificGenerics()
    {
        Debug.Log("\n=== Game-Specific Generics ===");
        
        // Create different types of pools
        ObjectPool<string> messagePool = new ObjectPool<string>(() => "Default Message");
        ObjectPool<Vector3> positionPool = new ObjectPool<Vector3>(() => Vector3.zero);
        
        // Get objects from pools
        string msg1 = messagePool.Get();
        string msg2 = messagePool.Get();
        Vector3 pos1 = positionPool.Get();
        
        Debug.Log($"Got message: {msg1}");
        Debug.Log($"Got position: {pos1}");
        
        // Return them to pool
        messagePool.Return(msg1);
        positionPool.Return(pos1);
        
        Debug.Log("Objects returned to pools");
    }
    
    // Generic method - works with any type
    void PrintArray<T>(T[] array)
    {
        Debug.Log($"Array of {typeof(T).Name}: [{string.Join(", ", array)}]");
    }
    
    // Generic method with constraints
    void Swap<T>(ref T a, ref T b)
    {
        T temp = a;
        a = b;
        b = temp;
    }
}

// Generic class - can hold any type
public class SimpleContainer<T>
{
    private T value;
    
    public SimpleContainer(T initialValue)
    {
        value = initialValue;
    }
    
    public T GetValue()
    {
        return value;
    }
    
    public void SetValue(T newValue)
    {
        value = newValue;
    }
}

// Generic object pool - useful for game development
public class ObjectPool<T>
{
    private List<T> availableObjects = new List<T>();
    private System.Func<T> createFunction;
    
    public ObjectPool(System.Func<T> createFunc)
    {
        createFunction = createFunc;
    }
    
    public T Get()
    {
        if (availableObjects.Count > 0)
        {
            T obj = availableObjects[0];
            availableObjects.RemoveAt(0);
            return obj;
        }
        else
        {
            return createFunction();
        }
    }
    
    public void Return(T obj)
    {
        if (!availableObjects.Contains(obj))
        {
            availableObjects.Add(obj);
        }
    }
}
```

## Asynchronous Programming with async/await

Async programming lets you do things that take time (like loading files or waiting) without freezing your game:

```csharp
using UnityEngine;
using System.Threading.Tasks;
using System.Collections;

public class AsyncExamples : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Starting async examples...");
        
        // Start some async operations
        LoadGameDataAsync();
        PerformLongCalculationAsync();
    }
    
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.L))
        {
            LoadPlayerDataAsync();
        }
        
        if (Input.GetKeyDown(KeyCode.S))
        {
            SaveGameAsync();
        }
        
        if (Input.GetKeyDown(KeyCode.C))
        {
            StartCoroutine(LoadLevelCoroutine());
        }
    }
    
    // Async method - doesn't block the main thread
    async void LoadGameDataAsync()
    {
        Debug.Log("Starting to load game data...");
        
        // Simulate loading time
        await Task.Delay(2000);  // Wait 2 seconds
        
        Debug.Log("Game data loaded!");
    }
    
    async void PerformLongCalculationAsync()
    {
        Debug.Log("Starting long calculation...");
        
        // Simulate a complex calculation
        int result = await CalculateSomethingComplexAsync();
        
        Debug.Log($"Calculation complete! Result: {result}");
    }
    
    async Task<int> CalculateSomethingComplexAsync()
    {
        // Simulate work
        await Task.Delay(3000);  // 3 seconds of "calculation"
        
        return Random.Range(1000, 9999);
    }
    
    async void LoadPlayerDataAsync()
    {
        Debug.Log("Loading player data...");
        
        try
        {
            // Simulate loading with possible failure
            await Task.Delay(1000);
            
            if (Random.Range(0, 100) < 20)  // 20% chance of failure
            {
                throw new System.Exception("Failed to load player data!");
            }
            
            Debug.Log("Player data loaded successfully!");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Error loading player data: {e.Message}");
        }
    }
    
    async void SaveGameAsync()
    {
        Debug.Log("Saving game...");
        
        // Show saving indicator
        ShowSavingIndicator(true);
        
        try
        {
            // Simulate save process
            await Task.Delay(1500);
            
            Debug.Log("Game saved successfully!");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to save game: {e.Message}");
        }
        finally
        {
            // Hide saving indicator whether it succeeded or failed
            ShowSavingIndicator(false);
        }
    }
    
    void ShowSavingIndicator(bool show)
    {
        Debug.Log(show ? "[UI] Showing save indicator..." : "[UI] Hiding save indicator");
    }
    
    // Coroutine for comparison - Unity's traditional way
    IEnumerator LoadLevelCoroutine()
    {
        Debug.Log("Loading level with coroutine...");
        
        for (int i = 0; i <= 100; i += 10)
        {
            Debug.Log($"Loading progress: {i}%");
            yield return new WaitForSeconds(0.2f);
        }
        
        Debug.Log("Level loaded with coroutine!");
    }
    
    // More practical async example - downloading data
    async void DownloadPlayerStatsAsync()
    {
        Debug.Log("Downloading player stats...");
        
        try
        {
            var stats = await FetchPlayerStatsAsync();
            UpdateUI(stats);
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to download stats: {e.Message}");
            ShowErrorMessage("Unable to load player stats");
        }
    }
    
    async Task<PlayerStats> FetchPlayerStatsAsync()
    {
        // Simulate network request
        await Task.Delay(2000);
        
        return new PlayerStats
        {
            Level = 25,
            Experience = 1500,
            Gold = 750,
            PlayTime = "45 hours"
        };
    }
    
    void UpdateUI(PlayerStats stats)
    {
        Debug.Log($"[UI] Updated stats - Level: {stats.Level}, XP: {stats.Experience}, Gold: {stats.Gold}");
    }
    
    void ShowErrorMessage(string message)
    {
        Debug.Log($"[UI] Error: {message}");
    }
}

public class PlayerStats
{
    public int Level;
    public int Experience;
    public int Gold;
    public string PlayTime;
}
```

**Try this yourself:**
1. Watch the console as different async operations complete
2. Press L to load player data (might fail sometimes)
3. Press S to save game (watch the save indicator)
4. Press C to see a coroutine for comparison

## Putting It All Together - Event-Driven Game System

Let's create a complete example that uses all these concepts:

```csharp
using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Game events using delegates
public static class GameEvents
{
    public static event Action<Player> OnPlayerLevelUp;
    public static event Action<Player, int> OnPlayerScoreChanged;
    public static event Action<string> OnQuestCompleted;
    public static event Action<Player, Achievement> OnAchievementUnlocked;
}

// Player class using all concepts
public class Player
{
    public string Name { get; private set; }
    public int Level { get; private set; }
    public int Experience { get; private set; }
    public int Score { get; private set; }
    public List<Achievement> Achievements { get; private set; }
    
    public Player(string name)
    {
        Name = name;
        Level = 1;
        Experience = 0;
        Score = 0;
        Achievements = new List<Achievement>();
    }
    
    public void AddExperience(int exp)
    {
        Experience += exp;
        CheckForLevelUp();
    }
    
    public void AddScore(int points)
    {
        Score += points;
        GameEvents.OnPlayerScoreChanged?.Invoke(this, Score);
    }
    
    void CheckForLevelUp()
    {
        int expNeeded = Level * 100;
        if (Experience >= expNeeded)
        {
            Level++;
            Experience = 0;
            GameEvents.OnPlayerLevelUp?.Invoke(this);
        }
    }
    
    public void UnlockAchievement(Achievement achievement)
    {
        if (!Achievements.Any(a => a.Id == achievement.Id))
        {
            Achievements.Add(achievement);
            GameEvents.OnAchievementUnlocked?.Invoke(this, achievement);
        }
    }
}

// Achievement class
public class Achievement
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Points { get; set; }
    
    public Achievement(string id, string name, string desc, int points)
    {
        Id = id;
        Name = name;
        Description = desc;
        Points = points;
    }
}

// Generic manager class
public class GameManager<T> : MonoBehaviour where T : class
{
    protected List<T> items = new List<T>();
    
    public virtual void Add(T item)
    {
        items.Add(item);
    }
    
    public virtual bool Remove(T item)
    {
        return items.Remove(item);
    }
    
    public virtual List<T> GetAll()
    {
        return new List<T>(items);
    }
    
    public virtual T Find(Func<T, bool> predicate)
    {
        return items.FirstOrDefault(predicate);
    }
}

// Achievement manager using generics and LINQ
public class AchievementManager : GameManager<Achievement>
{
    void Start()
    {
        InitializeAchievements();
        
        // Subscribe to events
        GameEvents.OnPlayerLevelUp += CheckLevelAchievements;
        GameEvents.OnPlayerScoreChanged += CheckScoreAchievements;
    }
    
    void OnDestroy()
    {
        // Unsubscribe from events
        GameEvents.OnPlayerLevelUp -= CheckLevelAchievements;
        GameEvents.OnPlayerScoreChanged -= CheckScoreAchievements;
    }
    
    void InitializeAchievements()
    {
        Add(new Achievement("first_level", "Level Up!", "Reach level 2", 10));
        Add(new Achievement("high_level", "Experienced", "Reach level 5", 50));
        Add(new Achievement("score_1k", "Scorer", "Reach 1000 points", 25));
        Add(new Achievement("score_5k", "High Scorer", "Reach 5000 points", 100));
    }
    
    void CheckLevelAchievements(Player player)
    {
        // Use LINQ to find relevant achievements
        var levelAchievements = items.Where(a => a.Id.Contains("level")).ToList();
        
        foreach (var achievement in levelAchievements)
        {
            if (achievement.Id == "first_level" && player.Level >= 2)
            {
                player.UnlockAchievement(achievement);
            }
            else if (achievement.Id == "high_level" && player.Level >= 5)
            {
                player.UnlockAchievement(achievement);
            }
        }
    }
    
    void CheckScoreAchievements(Player player, int newScore)
    {
        var scoreAchievements = items.Where(a => a.Id.Contains("score")).ToList();
        
        foreach (var achievement in scoreAchievements)
        {
            if (achievement.Id == "score_1k" && newScore >= 1000)
            {
                player.UnlockAchievement(achievement);
            }
            else if (achievement.Id == "score_5k" && newScore >= 5000)
            {
                player.UnlockAchievement(achievement);
            }
        }
    }
}

// Main game controller
public class AdvancedGameController : MonoBehaviour
{
    private Player currentPlayer;
    private AchievementManager achievementManager;
    
    void Start()
    {
        // Initialize
        currentPlayer = new Player("Hero");
        achievementManager = GetComponent<AchievementManager>();
        
        // Subscribe to events with lambdas
        GameEvents.OnPlayerLevelUp += player => Debug.Log($"🎉 {player.Name} reached level {player.Level}!");
        GameEvents.OnPlayerScoreChanged += (player, score) => Debug.Log($"📊 {player.Name}'s score: {score}");
        GameEvents.OnAchievementUnlocked += (player, achievement) => 
            Debug.Log($"🏆 Achievement Unlocked: {achievement.Name} - {achievement.Description}");
        
        StartGameAsync();
    }
    
    async void StartGameAsync()
    {
        Debug.Log("🎮 Starting game...");
        
        // Simulate loading
        await Task.Delay(1000);
        
        Debug.Log("✅ Game loaded! Use number keys to test features:");
        Debug.Log("1 - Add Experience, 2 - Add Score, 3 - Show Stats");
    }
    
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            currentPlayer.AddExperience(150);
        }
        
        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            currentPlayer.AddScore(500);
        }
        
        if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            ShowPlayerStats();
        }
    }
    
    void ShowPlayerStats()
    {
        Debug.Log($"\n=== {currentPlayer.Name}'s Stats ===");
        Debug.Log($"Level: {currentPlayer.Level}");
        Debug.Log($"Experience: {currentPlayer.Experience}");
        Debug.Log($"Score: {currentPlayer.Score}");
        Debug.Log($"Achievements: {currentPlayer.Achievements.Count}");
        
        if (currentPlayer.Achievements.Any())
        {
            Debug.Log("🏆 Unlocked Achievements:");
            currentPlayer.Achievements.ForEach(a => Debug.Log($"  • {a.Name}"));
        }
    }
}
```

**Try this complete system:**
1. Press 1 to add experience (watch for level ups!)
2. Press 2 to add score (watch for score achievements!)
3. Press 3 to show complete player stats
4. Notice how all systems communicate through events

## Practice Exercises

Try creating these on your own:

1. **Event-Based UI System**: Create a health bar that automatically updates when player health changes through events.

2. **Generic Inventory**: Create a generic inventory system that can hold any type of item.

3. **LINQ High Score System**: Use LINQ to create a high score system that can find top players, average scores, etc.

4. **Async Save System**: Create an async save system that shows progress and can handle errors.

5. **Lambda-Based Ability System**: Create an ability system where abilities are defined using lambda expressions.

## Key Takeaways

- **Delegates** are like function pointers that can hold references to methods
- **Events** are perfect for letting different systems communicate without direct connections
- **Lambda expressions** are short ways to write simple methods, great for LINQ and events
- **LINQ** gives you powerful tools to search, filter, and manipulate collections
- **Generics** let you create reusable classes and methods that work with any type
- **async/await** lets you do time-consuming operations without freezing the game
- These concepts work great together to create flexible, maintainable game systems

## Conclusion

Congratulations! You've now learned the advanced C# concepts that will make your Unity scripts much more powerful and professional. These tools might seem complex at first, but with practice, they'll become natural and incredibly useful for creating sophisticated game systems.

Remember: You don't need to use all of these concepts in every script. Use them when they make your code clearer, more flexible, or more efficient. Start simple and gradually incorporate these advanced features as you become more comfortable with them!