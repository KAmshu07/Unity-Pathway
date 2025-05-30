# Scene Setup Fundamentals

## Introduction

Scenes are the fundamental building blocks of Unity games, serving as containers for all the GameObjects, lighting, cameras, and other elements that make up your game world. Understanding how to effectively create, manage, and organize scenes is crucial for building maintainable and scalable games. This section will teach you the essential skills for scene management, GameObject hierarchy organization, transform manipulation, and efficient use of Scene view tools.

## Creating and Managing Scenes

Scenes in Unity represent different areas, levels, or states of your game. Proper scene management is essential for organizing your game's content and maintaining good performance.

### Scene Creation and Basic Management

**Creating New Scenes**
```csharp
// Creating a new scene via code
Scene newScene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects);
EditorSceneManager.SaveScene(newScene, "Assets/Scenes/NewLevel.unity");
```

**Scene Types and Templates**
When creating a new scene, Unity offers several templates:
- **Basic (Built-in Render Pipeline)**: Contains Main Camera and Directional Light
- **Basic (URP)**: Optimized for Universal Render Pipeline
- **Basic (HDRP)**: High Definition Render Pipeline setup
- **Empty**: Completely empty scene for custom setups

### Multi-Scene Workflows

Unity supports loading multiple scenes simultaneously, which is powerful for:
- **Additive Loading**: Load additional content without replacing the current scene
- **Persistent Managers**: Keep UI, audio managers, or game state across level changes
- **Level Streaming**: Load/unload sections of large worlds dynamically

```csharp
// Loading scenes additively
SceneManager.LoadScene("UIScene", LoadSceneMode.Additive);
SceneManager.LoadScene("GameplayScene", LoadSceneMode.Additive);

// Unloading specific scenes
SceneManager.UnloadSceneAsync("UIScene");

// Setting active scene for new object creation
SceneManager.SetActiveScene(SceneManager.GetSceneByName("GameplayScene"));
```

### Scene Organization Strategies

**1. Single Scene Approach**
- Entire game contained in one scene
- Simple for small projects
- Can become unwieldy for larger games

**2. Level-Based Scenes**
- Each level or area is a separate scene
- Common for linear games
- Easy to manage and test individual levels

**3. Modular Scene System**
```
Scenes/
├── Persistent/
│   ├── GameManager.unity        # Always loaded
│   ├── UI.unity                 # UI elements
│   └── Audio.unity              # Audio systems
├── Levels/
│   ├── Level01.unity
│   ├── Level02.unity
│   └── Level03.unity
└── Menus/
    ├── MainMenu.unity
    ├── OptionsMenu.unity
    └── LoadingScreen.unity
```

### Scene Loading and Performance

**Asynchronous Scene Loading**
```csharp
public class SceneLoader : MonoBehaviour
{
    public async void LoadSceneAsync(string sceneName)
    {
        // Load scene asynchronously with progress tracking
        AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName);
        
        // Prevent the scene from activating immediately
        asyncLoad.allowSceneActivation = false;
        
        while (!asyncLoad.isDone)
        {
            // Update loading progress (0.0 to 0.9 when ready)
            float progress = Mathf.Clamp01(asyncLoad.progress / 0.9f);
            UpdateLoadingUI(progress);
            
            // Activate scene when ready and conditions are met
            if (asyncLoad.progress >= 0.9f && ReadyToActivate())
            {
                asyncLoad.allowSceneActivation = true;
            }
            
            await Task.Yield();
        }
    }
    
    private void UpdateLoadingUI(float progress)
    {
        // Update your loading screen here
    }
    
    private bool ReadyToActivate()
    {
        // Your conditions for scene activation
        return true;
    }
}
```

## GameObjects Hierarchy and Nesting

The Hierarchy panel shows the parent-child relationships between GameObjects in your scene. Understanding how to organize this hierarchy is crucial for maintainable projects.

### Hierarchy Organization Principles

**1. Logical Grouping**
Organize objects by functionality or system:
```
Scene Hierarchy:
├── === MANAGERS ===
│   ├── GameManager
│   ├── AudioManager
│   └── UIManager
├── === ENVIRONMENT ===
│   ├── Terrain
│   ├── Buildings
│   │   ├── House_01
│   │   ├── House_02
│   │   └── Shop_01
│   └── Props
│       ├── Trees
│       └── Rocks
├── === CHARACTERS ===
│   ├── Player
│   └── NPCs
│       ├── Merchant
│       └── Guard
└── === UI ===
    ├── Canvas
    └── EventSystem
```

**2. Empty GameObject Containers**
Use empty GameObjects as organizational containers:
```csharp
// Creating organizational containers via script
public class SceneOrganizer : MonoBehaviour
{
    [MenuItem("Tools/Organize Scene")]
    static void OrganizeScene()
    {
        // Create main organization containers
        CreateContainer("=== MANAGERS ===");
        CreateContainer("=== ENVIRONMENT ===");
        CreateContainer("=== CHARACTERS ===");
        CreateContainer("=== UI ===");
    }
    
    static GameObject CreateContainer(string name)
    {
        GameObject container = new GameObject(name);
        container.transform.position = Vector3.zero;
        return container;
    }
}
```

**3. Naming Conventions**
Use consistent naming for easy identification:
- **Prefixes**: Use prefixes to group related objects (ENV_Tree, CHAR_Player, UI_Button)
- **Descriptive Names**: Avoid generic names like "GameObject" or "Cube"
- **Version Numbers**: Use numbers for variations (Tree_01, Tree_02, Tree_03)

### Parent-Child Relationships

Understanding parent-child relationships is fundamental to Unity scene organization:

**Transform Inheritance**
```csharp
// Child transforms are relative to their parent
public class TransformExample : MonoBehaviour
{
    void Start()
    {
        // Local position relative to parent
        transform.localPosition = new Vector3(1, 0, 0);
        
        // World position in scene space
        transform.position = new Vector3(5, 2, 3);
        
        // Setting parent relationship
        transform.SetParent(parentTransform);
        
        // Maintaining world position when parenting
        transform.SetParent(parentTransform, true);
    }
}
```

**Benefits of Proper Hierarchy**
- **Organized Movement**: Move parent to move all children
- **Grouped Operations**: Enable/disable entire groups
- **Performance**: Efficient culling and batching
- **Maintainability**: Easy to find and modify related objects

## Transform Manipulation

The Transform component is fundamental to every GameObject, controlling its position, rotation, and scale in 3D space.

### Understanding Transform Components

**Transform Properties**
```csharp
public class TransformManipulation : MonoBehaviour
{
    void Update()
    {
        // Position manipulation
        transform.position += Vector3.forward * Time.deltaTime;
        transform.Translate(Vector3.up * Time.deltaTime);
        
        // Rotation manipulation
        transform.rotation = Quaternion.Euler(0, 45, 0);
        transform.Rotate(Vector3.up, 90 * Time.deltaTime);
        
        // Scale manipulation
        transform.localScale = Vector3.one * 2f;
        transform.localScale = new Vector3(1, 2, 1); // Non-uniform scaling
    }
}
```

### Local vs. World Space

Understanding the difference between local and world space is crucial:

| Property | Description | Use Case |
|----------|-------------|----------|
| `transform.position` | World space position | Absolute positioning in scene |
| `transform.localPosition` | Position relative to parent | Relative positioning to parent object |
| `transform.rotation` | World space rotation | Absolute rotation in scene |
| `transform.localRotation` | Rotation relative to parent | Relative rotation to parent object |
| `transform.lossyScale` | World space scale (read-only) | Getting effective scale in world |
| `transform.localScale` | Scale relative to parent | Scaling relative to parent |

### Advanced Transform Operations

**Looking At Targets**
```csharp
// Make object look at target
transform.LookAt(target.position);

// Look at target but only rotate on Y-axis (for characters)
Vector3 targetDirection = target.position - transform.position;
targetDirection.y = 0; // Keep on same Y level
transform.rotation = Quaternion.LookRotation(targetDirection);
```

**Smooth Transformations**
```csharp
public class SmoothTransform : MonoBehaviour
{
    public Transform target;
    public float moveSpeed = 5f;
    public float rotateSpeed = 180f;
    
    void Update()
    {
        // Smooth movement towards target
        transform.position = Vector3.MoveTowards(
            transform.position, 
            target.position, 
            moveSpeed * Time.deltaTime
        );
        
        // Smooth rotation towards target
        Vector3 direction = target.position - transform.position;
        if (direction != Vector3.zero)
        {
            Quaternion targetRotation = Quaternion.LookRotation(direction);
            transform.rotation = Quaternion.RotateTowards(
                transform.rotation, 
                targetRotation, 
                rotateSpeed * Time.deltaTime
            );
        }
    }
}
```

## Using the Scene View Tools Effectively

The Scene view provides powerful tools for manipulating objects and navigating your 3D world efficiently.

### Scene View Navigation

**Mouse Navigation**
- **Alt + Left Mouse Drag**: Orbit around selection or scene center
- **Alt + Right Mouse Drag**: Zoom in/out
- **Alt + Middle Mouse Drag**: Pan view (Hand tool)
- **Mouse Wheel**: Zoom in/out
- **Right Mouse + WASD**: Fly-through navigation

**Keyboard Shortcuts for Navigation**
- **F**: Frame selected object in view
- **Shift + F**: Lock view to selected object
- **Double-click object**: Frame object and make it selection
- **Alt + Left/Right Arrow**: Orbit around selection in 90-degree increments

### Transform Tools and Shortcuts

**Primary Transform Tools**
```
Q - Hand Tool (Pan view)
W - Move Tool (Translate)
E - Rotate Tool
R - Scale Tool
T - Rect Tool (for 2D and UI)
Y - Transform Tool (Combined move, rotate, scale)
```

**Transform Tool Options**
- **Global vs. Local**: Toggle coordinate space (top-left toolbar)
- **Center vs. Pivot**: Choose transformation center point
- **Grid Snapping**: Hold Ctrl while transforming
- **Vertex Snapping**: Hold V and drag from vertices

### Advanced Scene View Features

**Scene View Modes**
Access different view modes through the Scene view toolbar:
- **Wireframe**: Show object outlines only
- **Shaded**: Standard lit view
- **Shaded Wireframe**: Combination of both
- **Material Override**: View with specific material

**Scene View Overlays**
```csharp
// Custom scene view overlay example
#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.Overlays;

[Overlay(typeof(SceneView), "Custom Tools")]
public class CustomToolsOverlay : Overlay
{
    public override void OnGUI()
    {
        if (GUILayout.Button("Align to Ground"))
        {
            AlignSelectedToGround();
        }
        
        if (GUILayout.Button("Randomize Rotation"))
        {
            RandomizeSelectedRotation();
        }
    }
    
    void AlignSelectedToGround()
    {
        foreach (Transform t in Selection.transforms)
        {
            if (Physics.Raycast(t.position, Vector3.down, out RaycastHit hit))
            {
                t.position = hit.point;
            }
        }
    }
    
    void RandomizeSelectedRotation()
    {
        foreach (Transform t in Selection.transforms)
        {
            t.rotation = Quaternion.Euler(
                0, 
                Random.Range(0, 360), 
                0
            );
        }
    }
}
#endif
```

### Efficient Workflow Techniques

**Multi-Selection and Batch Operations**
```csharp
// Script for batch operations on selected objects
public class BatchOperations : MonoBehaviour
{
    [MenuItem("Tools/Batch Operations/Reset Transforms")]
    static void ResetSelectedTransforms()
    {
        foreach (Transform t in Selection.transforms)
        {
            Undo.RecordObject(t, "Reset Transform");
            t.localPosition = Vector3.zero;
            t.localRotation = Quaternion.identity;
            t.localScale = Vector3.one;
        }
    }
    
    [MenuItem("Tools/Batch Operations/Add Rigidbody")]
    static void AddRigidbodyToSelected()
    {
        foreach (GameObject obj in Selection.gameObjects)
        {
            if (obj.GetComponent<Rigidbody>() == null)
            {
                Undo.AddComponent<Rigidbody>(obj);
            }
        }
    }
}
```

**Scene View Gizmos and Handles**
```csharp
// Custom gizmos for better scene visualization
public class CustomGizmos : MonoBehaviour
{
    public float detectionRange = 5f;
    public Color gizmoColor = Color.red;
    
    void OnDrawGizmos()
    {
        // Always visible gizmos
        Gizmos.color = gizmoColor;
        Gizmos.DrawWireSphere(transform.position, detectionRange);
    }
    
    void OnDrawGizmosSelected()
    {
        // Only visible when object is selected
        Gizmos.color = Color.yellow;
        Gizmos.DrawRay(transform.position, transform.forward * 3f);
    }
}
```

**Prefab Workflow in Scene View**
- **Select Prefab Root**: Use the prefab selection dropdown
- **Edit in Prefab Mode**: Double-click prefab to enter isolated editing
- **Override Visualization**: Blue bars indicate modified properties
- **Apply/Revert Changes**: Use Inspector prefab controls

## Conclusion

Mastering scene setup fundamentals provides the foundation for all Unity development. The skills covered in this section—scene management, hierarchy organization, transform manipulation, and Scene view navigation—will be used in every aspect of game development. As you progress through more advanced topics, these fundamentals will allow you to work efficiently and maintain organized, professional projects.

---

## Knowledge Check

1. What are the advantages of using a multi-scene workflow compared to a single scene approach?
2. Explain the difference between `transform.position` and `transform.localPosition`. When would you use each?
3. How do you create an effective GameObject hierarchy organization strategy?
4. What keyboard shortcuts are used for the primary transform tools in Unity?
5. Describe how to use asynchronous scene loading and why it's important for user experience.
6. What is the purpose of scene view gizmos, and how do you implement custom gizmos for your objects?