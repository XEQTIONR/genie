interface ToolGroup {
    name: string
    items: string[]
}

const tools : ToolGroup[] = [
    {
        name: 'Game Engines',
        items: [
            'Unity',
            'Unreal Engine',
            'Godot',
            'Cry Engine',
            'GameMaker Studio',
            'Construct',
            'RPG Maker',
            'Cocos',
            'Defold',
            'Stride',
            'Ren\'Py',
            'PICO-8',
            'GDevelop',
            'Love2D',
            'Phaser',
            'Adventure Game Studio',
        ]
    },
    {
        name: '2D Art',
        items: [
            'Photoshop',
            'Illustrator',
            'Affinity',
            'Aseprite',
            'Krita',
            'Clip Studio Paint',
            'Procreate',
            'GIMP',
        ]
    },
    {
        name: '3D Modelling and Texturing',
        items: [
            'Blender',
            'Autodesk Maya',
            'Audodesk 3ds Max',
            'Cinema 4D',
            'Zbrush',
            'Mudbox',
            'Houdini',
            'Substance Painter',
            'Substance Designer',
            'Quixel Mixer',
            'Marvelous Designer',
        ]
    },
    {
        name: '3D Animation',
        items: [
            'Blender',
            'Autodesk Maya',
            'Autodesk 3ds Max',
            'MotionBuilder',
            'Mixamo',
        ]
    },
    {
        name: '2D Animation / Skeletal Animation',
        items: [
            'Spline',
            'DragonBones',
            'Live2D Cubism',
            'Toon Boom Harmony',
            'Spriter',
        ]
    },
    {
        name: 'Sound Design & Editing',
        items: [
            'Audacity',
            'Adobe Audition',
            'Reaper',
            'Pro Tools',
            'FL Studio',
            'Ableton Live',
            'Logic Pro',
        ]
    },
    {
        name: 'Game-Ready Audio Middleware',
        items: [
            'FMOD',
            'Wwise',
            'Fabric Audio Tool',
        ]
    },
    {
        name: 'SFX Libraries',
        items: [
            'Boom Library',
            'Soundly',
            'ZapSplat',
        ]
    },
    {
        name: 'Level Design & World Building',
        items: [
            'Unreal Engine Landscape Tools',
            'Unity Terrain Tools',
            'World Machine',
            'Gaea',
            'Houdini',
            'CityEngine',
            'Tiled Map Editor',
            'TrenchBoom',
        ]
    },
    {
        name: 'Version Control',
        items: [
            'Git',
            'GitHub',
            'GitLab',
            'BitBucket',
            'Plastic SCM',
            'Perforce Helix Core',
        ]
    },
    {
        name: 'CI/CD',
        items: [
            'Jenkins',
            'Azure DevOps',
            'Github Actions',
            'Team City',
        ]
    },
    {
        name: 'Build Automation',
        items: [
            'CMake',
            'Gradle',
        ]
    },
    {
        name: 'Testing and Debugging',
        items: [
            'Unity Profiler',
            'Unreal Insights',
            'RenderDoc',
            'Pix for Windows',
            'NVIDIA Nsight',
            'Valgrind',
            'Cheat Engine',
            'TestRail',
            'App Center',
        ]
    },
    {
        name: 'Network & Multiplayer Tools',
        items: [
            'Photon',
            'Mirror (Unity)',
            'Netcode for GameObjects (Unity)',
            'Epic Online Services',
            'Steamworks',
            'PlayFab',
            'GameSparks',
            'Colyseus',
            'Nakama',
        ]
    },
    {
        name: 'UI/UX Tools',
        items: [
            'Figma',
            'Adobe XD',
            'Sketch',
            'InVision',
            'Miro',
            'Unity UI Toolkit',
            'Unreal UMG',
        ]
    },
    {
        name: 'Cinematics & Cutscene Tools',
        items: [
            'Unreal Sequencer',
            'Unity Timeline + Cinemachine',
            'Blender',
            'Davinci Resolve',
            'After Effects',
        ]
    },
    {
        name: 'Publishing & Analytics',
        items: [
            'Steamworks',
            'Epic Games Developer Portal',
            'Google Play Console',
            'Apple Store Connect',
            'Itch.io Butlier',
            'GameAnalytics',
            'Unity Analytics',
            'Firebase Analytics',
        ]
    },
    {
        name: 'Project Management Tools',
        items: [
            'JIRA',
            'Trello',
            'Asana',
            'Notion',
            'ClickUp',
            'Miro',
            'Slack',
            'Discord',
        ]
    },
    {
        name: 'AI & Procedural Tools',
        items: [
            'Houdini',
            'Gaia',
            'SpeedTree',
            'NVIDIA Omniverse',
            'Charisma.ai',
            'Inworld AI',
        ]
    },
    {
        name: 'Platform-Specific SDKs',
        items: [
            'Android SDK',
            'iOS SDK',
            'Nintendo Switch SDK',
            'PlayStation SDK',
            'Xbox SDK',
        ]
    }
]

export default tools

export type { ToolGroup }