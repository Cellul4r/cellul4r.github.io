import type { ProjectMedia } from '../types/portfolio'
import gameplay from '../assets/projects/typing-vs-demon/play_menu.png'
import mainMenu from '../assets/projects/typing-vs-demon/main_menu.png'
import tutorial from '../assets/projects/typing-vs-demon/tutorial_menu.png'
import scienceWeek from '../assets/projects/typing-vs-demon/science-week.jpg'

const repository = 'https://github.com/Cellul4r/typing_vs_demon_game'
const sourceRoot = `${repository}/blob/db976add0605726f900cf5b08135beaad0b4ca3b/src`

export const typingVsDemon = {
  title: 'Typing VS Demon',
  eyebrow: 'Java OOP course project',
  description: 'A typing survival game where your keyboard is the weapon. Switch lanes, type the word above a demon, and defeat it before it reaches the castle.',
  sourceUrl: repository,
  playUrl: 'https://cellul4r.github.io/typing_vs_demon_game/',
  playNote: 'Best played on a desktop with a keyboard. The first load may take a moment.',
  facts: [
    { label: 'My role', value: 'Team Lead & Developer' },
    { label: 'Team', value: 'Five people' },
    { label: 'Built with', value: 'Java · Swing/AWT' },
    { label: 'Started', value: 'Feb–Mar 2025' },
  ],
  navigation: [
    { id: 'tvd-story', label: 'The idea' },
    { id: 'tvd-contributions', label: 'My contribution' },
    { id: 'tvd-engineering', label: 'Design decisions' },
    { id: 'tvd-players', label: 'Real players' },
    { id: 'tvd-next', label: 'Looking ahead' },
  ],
  story: [
    'I enjoy practicing my typing speed on Monkeytype and typing-race websites. When our Java OOP course asked us to build a game, I pitched combining typing practice with a survival game. Our team turned that idea into a princess defending her kingdom across five lanes, with increasingly difficult waves and items to help her survive.',
    'It was our first Java game. We learned about game loops, sprites, animation, and rendering as we went, then worked out how to fit those pieces to our gameplay. Before splitting up the work, we discussed the class relationships and agreed on tile sizes so the artwork would fit the game’s grid.',
  ],
  contributions: [
    {
      title: 'Gameplay implementation',
      description: 'I personally implemented the Wave subsystem and contributed to core gameplay.',
      items: ['Lane-based target management, spawning, and wave progression', 'Typed-word matching, items, collisions, scoring, and map rendering'],
    },
    {
      title: 'Design & coordination',
      description: 'I pitched the game concept and helped organize the software design.',
      items: ['Discussed class relationships and shared tile sizes with the team', 'Planned the GameState redesign; a teammate implemented it'],
    },
  ],
  teamCredit: 'My teammates contributed other programming work, artwork, UI, animation, sound, and documentation.',
  wave: {
    title: 'Inside the Wave subsystem.',
    intro: 'I implemented Wave to organize lane-based targets, spawn enemies and items, and progress between waves.',
    points: [
      { title: 'One list per lane', code: 'ArrayList<WordObject>[]', sourceUrl: `${sourceRoot}/event/Wave.java#L22-L60`, detail: 'Each lane has its own list of enemies and items. Typed-word matching checks only the player’s current lane.' },
      { title: 'More targets as waves progress', code: 'createWave()', sourceUrl: `${sourceRoot}/event/Wave.java#L63-L68`, detail: 'The target count grows with the current level and a difficulty-specific enemyFactor, increasing pressure as the game progresses.' },
      { title: 'Keep speed within a playable range', code: 'Enemy.setSpeed()', sourceUrl: `${sourceRoot}/entity/Enemy.java#L94-L97`, detail: 'Enemy speed scales with the level but is capped using Math.min(maxSpeed, …). This keeps travel speed bounded as target counts grow; I adjusted starting and maximum speeds after student playtesting.' },
    ],
    sources: [
      { label: 'Explore Wave.java', url: `${sourceRoot}/event/Wave.java#L22-L66` },
      { label: 'See the enemy speed limit', url: `${sourceRoot}/entity/Enemy.java#L94-L97` },
    ],
  },
  wordDesign: {
    title: 'Share the behavior, keep the differences.',
    paragraphs: [
      'At first, enemies, items, and the player all inherited directly from Entity. Enemies and items both needed words attached to them, so we introduced WordObject to share word generation and label rendering.',
      'Item effects stayed in their own classes: the player calls useItem(), and the item decides whether to heal, freeze enemies, or clear a lane.',
    ],
    sourceUrl: `${sourceRoot}/entity/WordObject.java`,
    sourceLabel: 'Explore WordObject.java',
  },
  stateDesign: {
    title: 'Give each game state a name.',
    paragraphs: [
      'Game states were harder to organize. As we added screens, the numeric values controlling them became difficult to remember. We moved toward named state classes and a GameStateManager, making the connections between menus, playing, pausing, and game over easier to follow.',
    ],
    attribution: 'I planned the redesigned structure and delegated its implementation to a teammate.',
    sourceUrl: `${sourceRoot}/gamestate/GameStateManager.java`,
    sourceLabel: 'Explore GameStateManager.java',
    states: [
      { label: 'Main menu', className: 'TitleMainState' },
      { label: 'Tutorial', className: 'TitleTutorialState' },
      { label: 'Difficulty', className: 'TitleDifficultyState' },
      { label: 'Playing', className: 'PlayState' },
      { label: 'Paused', className: 'PauseState' },
      { label: 'Game over', className: 'GameOverState' },
    ],
  },
  feedback: [
    { label: 'What players told us', text: 'At Chiang Mai University Science Week, primary and secondary school students tried the game. Some told us the demons moved too fast, especially the witch.' },
    { label: 'What I changed', text: 'I adjusted the starting and maximum speeds of the witch and other enemies in response.' },
  ],
  takeaway: 'That gave me a chance to take a player’s complaint and connect it to a specific part of the implementation.',
  improvements: [
    { title: 'Separate gameplay from presentation', description: 'Many gameplay classes still depend on the central GamePanel. I’d separate more gameplay rules from rendering and audio so they can be tested with less setup.' },
    { title: 'Make time and randomness testable', description: 'I’d use a controllable clock and seeded randomness to replay the same enemy spawns and item effects. This would make timing bugs reproducible and let me compare difficulty changes under identical conditions. Playtesting would still be needed to judge how balanced the game feels.' },
  ],
  resources: [
    { label: 'RyiSnow’s Java 2D game tutorial', url: 'https://www.youtube.com/watch?v=om59cwR7psI&list=PL_QPQmz5C6WUF-pOQDsbsKbaBZqXj4qSq', detail: 'Learning resource' },
    { label: 'TommyQ: Zombie Defender', url: 'https://www.typing.com/student/game/tommyq', detail: 'Typing-game inspiration' },
  ],
} as const

export const typingVsDemonMedia = {
  gameplay: {
    src: gameplay, width: 988, height: 738,
    alt: 'Typing VS Demon gameplay showing the princess, word-labeled enemies, and a healing item across five lanes',
    caption: 'Five lanes. Incoming demons. A keyboard to defend the kingdom.',
  },
  mainMenu: {
    src: mainMenu, width: 960, height: 672,
    alt: 'Typing VS Demon main menu with a pixel-art castle and princess',
    caption: 'The kingdom before the first wave.',
  },
  tutorial: {
    src: tutorial, width: 960, height: 672,
    alt: 'Game controls: arrow keys switch lanes, Enter submits a typed word, and Spacebar uses an item',
    caption: 'Switch lanes, type a word, and press Enter to attack.',
  },
  showcase: {
    src: scienceWeek, width: 4624, height: 2084,
    alt: 'Students in a computer lab trying Typing VS Demon at Chiang Mai University Science Week',
    caption: 'Students trying Typing VS Demon at Chiang Mai University Science Week.',
  },
} satisfies Record<string, ProjectMedia>
