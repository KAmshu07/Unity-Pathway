# Unity Project Structure

## Introduction

Understanding Unity's project structure is fundamental to maintaining organized, scalable, and collaborative game projects. A well-structured project not only makes development more efficient but also enables better version control, asset management, and team collaboration. This section covers the standard folder organization, asset types, project settings, and build configurations that form the backbone of professional Unity development.

## Standard Folder Organization

Unity projects benefit greatly from consistent folder organization. While Unity doesn't enforce a specific structure, following industry-standard conventions will make your projects more maintainable and easier for other developers to understand.

### Recommended Root Folder Structure

```
Assets/
├── _Project/                    # Project-specific assets
│   ├── Scripts/
│   ├── Prefabs/
│   ├── Materials/
│   ├── Textures/
│   └── Scenes/
├── Art/                         # All artistic assets
│   ├── Models/
│   ├── Animations/
│   ├── Textures/
│   └── UI/
├── Audio/                       # Sound and music assets
│   ├── Music/
│   ├── SFX/
│   └── Voice/
├── Plugins/                     # Third-party plugins
├── Resources/                   # Runtime-loaded resources
├── StreamingAssets/             # Platform-specific streaming assets
└── Editor/                      # Editor-only scripts and tools
```

### Detailed Folder Descriptions

**Scripts Folder Organization**
```
Scripts/
├── Player/                      # Player-related scripts
├── Enemies/                     # Enemy AI and behavior
├── UI/                          # User interface scripts
├── Managers/                    # Game managers and systems
├── Utilities/                   # Helper and utility scripts
├── Audio/                       # Audio management scripts
└── Data/                        # ScriptableObjects and data structures
```

**Prefabs Organization**
```
Prefabs/
├── Characters/                  # Player and NPC prefabs
├── Environment/                 # Environmental objects
├── UI/                          # User interface prefabs
├── Effects/                     # Particle systems and effects
├── Items/                       # Collectibles and interactive objects
└── Managers/                    # Manager prefabs (spawners, etc.)
```

**Materials and Textures**
```
Materials/
├── Characters/
├── Environment/
├── UI/
└── Effects/

Textures/
├── Characters/
├── Environment/
├── UI/
└── Icons/
```

### Special Unity Folders

Unity recognizes certain folder names and treats them differently:

| Folder Name | Purpose | Special Behavior |
|-------------|---------|------------------|
| Editor | Editor-only scripts | Not included in builds |
| Resources | Runtime loading | Can be loaded with Resources.Load() |
| StreamingAssets | Platform assets | Copied to build without processing |
| Plugins | Native plugins | Platform-specific compilation |
| Gizmos | Scene view icons | Used for custom gizmos |
| Hidden Assets | Unity's internal | Contains imported asset data |

## Asset Types and Importing Process

Unity supports a wide variety of asset types, each with specific import settings and optimization options.

### Common Asset Types

**3D Assets**
- **Models**: .fbx, .obj, .dae, .3ds, .blend, .ma/.mb
- **Animations**: Embedded in model files or separate animation files
- **Materials**: Unity materials (.mat) or imported from 3D software

**2D Assets**
- **Textures**: .png, .jpg, .tga, .psd, .tiff, .gif, .bmp, .iff, .pict
- **Sprites**: 2D textures configured for sprite rendering
- **Sprite Atlases**: Collections of sprites packed for performance

**Audio Assets**
- **Audio Clips**: .wav, .mp3, .ogg, .aiff, .mod, .it, .s3m, .xm
- **Audio Mixers**: Unity's audio mixing and effects system

**Script Assets**
- **C# Scripts**: .cs files containing game logic
- **Visual Scripts**: Unity's visual scripting graphs
- **Shaders**: .shader, .hlsl files for custom rendering

### Import Process and Settings

When assets are imported into Unity, they go through a processing pipeline:

1. **Detection**: Unity detects new or modified assets
2. **Import**: Assets are processed according to their type
3. **Generation**: Unity creates internal representations and metadata
4. **Optimization**: Assets are optimized for target platforms

**Texture Import Settings Example**
```csharp
// Example of setting texture import settings via script
TextureImporter textureImporter = AssetImporter.GetAtPath(assetPath) as TextureImporter;
textureImporter.textureType = TextureImporterType.Sprite;
textureImporter.spriteImportMode = SpriteImportMode.Single;
textureImporter.mipmapEnabled = false;
textureImporter.SaveAndReimport();
```

**Model Import Settings**
- **Scale Factor**: Adjust size to match Unity's scale
- **Materials**: Choose how to handle materials from 3D software
- **Animations**: Configure animation clips and compression
- **Normals & Tangents**: Control normal map calculations

### Asset Workflow Best Practices

1. **Consistent Naming Conventions**
   ```
   // Examples of good naming conventions
   Player_Idle_Animation.fbx
   UI_Button_Primary.png
   SFX_Jump_01.wav
   MAT_Grass_Diffuse.mat
   ```

2. **Proper Resolution and Compression**
   - Use power-of-two textures when possible (256x256, 512x512, etc.)
   - Choose appropriate compression formats for target platforms
   - Consider texture streaming for large worlds

3. **Asset Dependencies**
   - Keep assets self-contained when possible
   - Use relative paths for cross-references
   - Avoid circular dependencies between assets

## Project Settings and Configuration

Unity's Project Settings control global behavior and platform-specific configurations for your game.

### Key Project Settings Categories

**Player Settings**
- **Company Name & Product Name**: Metadata for your game
- **Version & Bundle Identifier**: Used for publishing and updates
- **Supported Orientations**: For mobile development
- **Splash Screen**: Customization of startup screen
- **Icon Settings**: Platform-specific application icons

**Quality Settings**
```csharp
// Example: Accessing quality settings in code
QualitySettings.SetQualityLevel(2); // Set to "Good" quality level
int currentLevel = QualitySettings.GetQualityLevel();
```

Quality levels define:
- Render pipeline settings
- Shadow quality and distance
- Texture quality and filtering
- Particle density
- LOD bias and maximum LOD level

**Physics Settings**
- **Gravity**: Default gravity value for physics simulation
- **Default Material**: Physics material for colliders without materials
- **Queries Hit Triggers**: Whether physics queries detect trigger colliders
- **Layer Collision Matrix**: Define which layers interact with each other

**Time Settings**
- **Fixed Timestep**: Update frequency for FixedUpdate()
- **Maximum Allowed Timestep**: Prevents spiral of death in physics
- **Time Scale**: Global time scaling factor

**Audio Settings**
- **Global Volume**: Master volume control
- **Rolloff Scale**: 3D audio distance calculations
- **Sample Rate**: Audio quality settings
- **DSP Buffer Size**: Audio latency vs. CPU trade-off

### Input System Configuration

Unity offers two input systems:

**Legacy Input Manager**
```csharp
// Legacy input system example
float horizontal = Input.GetAxis("Horizontal");
bool jumpPressed = Input.GetKeyDown(KeyCode.Space);
```

**New Input System**
```csharp
// New input system example
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    private PlayerInput playerInput;
    
    private void Awake()
    {
        playerInput = GetComponent<PlayerInput>();
    }
    
    public void OnMove(InputAction.CallbackContext context)
    {
        Vector2 movement = context.ReadValue<Vector2>();
    }
}
```

## Build Settings Overview

Build Settings determine how your game is compiled and packaged for different platforms.

### Platform Selection and Switching

Unity supports multiple target platforms:
- **PC, Mac & Linux Standalone**
- **iOS & Android**
- **WebGL**
- **Console Platforms** (PlayStation, Xbox, Nintendo Switch)
- **VR Platforms** (Oculus, OpenXR, etc.)

**Switching Platforms**
```csharp
// Example: Switching build target via script
EditorUserBuildSettings.SwitchActiveBuildTarget(
    BuildTargetGroup.Standalone, 
    BuildTarget.StandaloneWindows64
);
```

### Scenes in Build

The "Scenes in Build" list determines which scenes are included in your game:
- Scene order affects scene indices used in code
- Scene 0 is typically the main menu or first level
- Use `SceneManager.LoadScene()` to switch between scenes

```csharp
// Loading scenes by name or index
SceneManager.LoadScene("MainMenu");
SceneManager.LoadScene(0); // Load first scene in build settings
```

### Platform-Specific Settings

**Standalone Platforms**
- **Architecture**: x86, x64, Universal
- **Scripting Backend**: Mono vs. IL2CPP
- **Api Compatibility Level**: .NET Standard 2.0 vs. .NET Framework

**Mobile Platforms**
- **Orientation**: Portrait, Landscape, Auto-rotation
- **Minimum OS Version**: Compatibility requirements
- **Graphics APIs**: OpenGL ES, Vulkan, Metal
- **Scripting Backend**: IL2CPP for performance

**WebGL**
- **Compression Format**: Gzip, Brotli, or Disabled
- **Memory Size**: Heap size for web builds
- **Publishing Settings**: Template and build optimizations

### Advanced Build Configuration

**Player Settings per Platform**
```csharp
// Example: Conditional compilation for different platforms
#if UNITY_STANDALONE
    // PC-specific code
#elif UNITY_MOBILE
    // Mobile-specific code
#elif UNITY_WEBGL
    // WebGL-specific code
#endif
```

**Build Automation**
```csharp
// Example build script for automation
public class BuildScript
{
    [MenuItem("Build/Build All Platforms")]
    static void BuildAllPlatforms()
    {
        // Build Windows
        BuildPipeline.BuildPlayer(
            GetScenePaths(),
            "Builds/Windows/Game.exe",
            BuildTarget.StandaloneWindows64,
            BuildOptions.None
        );
        
        // Build macOS
        BuildPipeline.BuildPlayer(
            GetScenePaths(),
            "Builds/macOS/Game.app",
            BuildTarget.StandaloneOSX,
            BuildOptions.None
        );
    }
    
    static string[] GetScenePaths()
    {
        return System.Array.ConvertAll(
            EditorBuildSettings.scenes,
            scene => scene.path
        );
    }
}
```

## In the Next Section

In the next section, we'll dive into Scene Setup Fundamentals, where you'll learn how to create and manage scenes, work with GameObjects hierarchy, and master the essential tools for building your game worlds.

---

## Knowledge Check

1. What is the purpose of the "Resources" folder, and when should you use it?
2. Describe the recommended folder structure for a Unity project and explain why organization matters.
3. What are the key differences between the Legacy Input Manager and the New Input System?
4. How do you configure which scenes are included in your build, and why is scene order important?
5. What factors should you consider when choosing platform-specific settings for mobile vs. desktop builds?
6. Name three special Unity folders and explain how Unity treats each one differently.