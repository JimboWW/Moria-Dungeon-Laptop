       
        // GameState()
        const gameContainerDiv = document.getElementById('game-container-div');
        const createCharacterDiv = document.getElementById('create-character-div');
        const newCharacterName = document.getElementById('p-name');

        const GameState = {
            // Current game state
            state: {
                // NEW player: {} 6/19
                player: {
                    x: 0, 
                    y: 0, 
                    hp: CONFIG.PLAYER_DEFAULTS.hp, 
                    maxHp: CONFIG.PLAYER_DEFAULTS.maxHp, 
                    level: CONFIG.PLAYER_DEFAULTS.level, 
                    xp: CONFIG.PLAYER_DEFAULTS.xp, 
                    gold: CONFIG.PLAYER_DEFAULTS.gold,
                    weapon: CONFIG.PLAYER_DEFAULTS.weapon, 
                    armor: CONFIG.PLAYER_DEFAULTS.armor,
                    name: CONFIG.PLAYER_DEFAULTS.name,
                    hasMemory: CONFIG.PLAYER_DEFAULTS.hasMemory,
                    alive: true
                },
                dungeon: [],
                monsters: [],
                treasures: [],
                stairs: { down: null, up: null },
                depth: 1,
                messages: [],
                memoryBook: null,
                inCombat: false,
                gameActive: false,
                currentScreen: "Create Character"
            },
            
            // Get current state
            get() {
                return this.state;
            },

            // NEW Reset game state 6/19
            reset() {
                this.state = {
                    player: {
                        x: 0, 
                        y: 0, 
                        hp: CONFIG.PLAYER_DEFAULTS.hp, 
                        maxHp: CONFIG.PLAYER_DEFAULTS.maxHp, 
                        level: CONFIG.PLAYER_DEFAULTS.level, 
                        xp: CONFIG.PLAYER_DEFAULTS.xp, 
                        gold: CONFIG.PLAYER_DEFAULTS.gold,
                        weapon: CONFIG.PLAYER_DEFAULTS.weapon, 
                        armor: CONFIG.PLAYER_DEFAULTS.armor,
                        name: CONFIG.PLAYER_DEFAULTS.name,
                        hasMemory: CONFIG.PLAYER_DEFAULTS.hasMemory,
                        alive: true
                    },
                    dungeon: [],
                    monsters: [],
                    treasures: [],
                    stairs: { down: null, up: null },
                    depth: 1,
                    messages: [],
                    memoryBook: null,
                    inCombat: false,
                    gameActive: false,
                    currentScreen: "Create Character"
                };
            },

            // Add message to log
            addMessage(message, isSpecial = false) {
                this.state.messages.push({ text: message, special: isSpecial });
                if (this.state.messages.length > 100) {
                    this.state.messages.shift();
                }
            },
            
            // Player methods
            getPlayer() {
                return this.state.player;
            },
            
            setPlayerPosition(x, y) {
                this.state.player.x = x;
                this.state.player.y = y;
            },
            
            // Dungeon methods
            getDungeon() {
                return this.state.dungeon;
            },
            
            setDungeon(dungeon) {
                this.state.dungeon = dungeon;
            },
            
            getTileAt(x, y) {
                if (x < 0 || x >= CONFIG.DUNGEON_WIDTH || y < 0 || y >= CONFIG.DUNGEON_HEIGHT) {
                    return CONFIG.SYMBOLS.wall;
                }
                return this.state.dungeon[y][x];
            },
            
            // Monster methods
            getMonsters() {
                return this.state.monsters;
            },
            
            setMonsters(monsters) {
                this.state.monsters = monsters;
            },
            
            getMonsterAt(x, y) {
                return this.state.monsters.find(m => m.x === x && m.y === y);
            },

            // NEW removeMonster()
            removeMonster(monster) {
                this.state.monsters = this.state.monsters.filter(
                    m => m.x !== monster.x || m.y !== monster.y
                );
                console.log(`Removed monster at (${monster.x}, ${monster.y}). Monsters remaining: ${this.state.monsters.length}`);
            },

            // Treasure methods
            getTreasures() {
                return this.state.treasures;
            },
            
            setTreasures(treasures) {
                this.state.treasures = treasures;
            },
            
            getTreasureAt(x, y) {
                return this.state.treasures.find(t => t.x === x && t.y === y);
            },
            
            removeTreasure(treasure) {
                const index = this.state.treasures.indexOf(treasure);
                if (index > -1) {
                    this.state.treasures.splice(index, 1);
                }
            },
            
            // Memory book methods
            getMemoryBook() {
                return this.state.memoryBook;
            },
            
            setMemoryBook(book) {
                this.state.memoryBook = book;
            },
            
            getMemoryBookAt(x, y) {
                return this.state.memoryBook && this.state.memoryBook.x === x && this.state.memoryBook.y === y ? this.state.memoryBook : null;
            },
            
            removeMemoryBook() {
                this.state.memoryBook = null;
            },
            
            // Stairs methods
            getStairs() {
                return this.state.stairs;
            },
            
            setStairs(stairs) {
                this.state.stairs = stairs;
            },
            
            // Depth methods
            getDepth() {
                return this.state.depth;
            },
            
            incrementDepth() {
                this.state.depth++;
            },
            
            decrementDepth() {
                this.state.depth--;
            },
            
            // Messages
            getMessages() {
                return this.state.messages;
            }
        };

        // Utility functions
        const Utils = {
            // Random number between min and max (inclusive)
            randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            
            // Random element from array
            randomElement(array) {
                return array[Math.floor(Math.random() * array.length)];
            },
            
            // Check if two rectangles overlap
            rectanglesOverlap(rect1, rect2, buffer = 1) {
                return rect1.x < rect2.x + rect2.width + buffer && 
                    rect1.x + rect1.width + buffer > rect2.x &&
                    rect1.y < rect2.y + rect2.height + buffer && 
                    rect1.y + rect1.height + buffer > rect2.y;
            },
            
            // Get empty floor tiles (not occupied by player, monsters, treasures, or stairs)
            getEmptyFloorTiles() {
                const tiles = [];
                const gameState = GameState.get();
                
                for (let y = 0; y < CONFIG.DUNGEON_HEIGHT; y++) {
                    for (let x = 0; x < CONFIG.DUNGEON_WIDTH; x++) {
                        if (gameState.dungeon[y][x] === CONFIG.SYMBOLS.floor &&
                            !(x === gameState.player.x && y === gameState.player.y) &&
                            !gameState.monsters.some(m => m.x === x && m.y === y) &&
                            !gameState.treasures.some(t => t.x === x && t.y === y) &&
                            !(gameState.stairs.down && gameState.stairs.down.x === x && gameState.stairs.down.y === y) &&
                            !(gameState.stairs.up && gameState.stairs.up.x === x && gameState.stairs.up.y === y) &&
                            !(gameState.memoryBook && gameState.memoryBook.x === x && gameState.memoryBook.y === y)) {
                            tiles.push({ x, y });
                        }
                    }
                }
                return tiles;
            },
            
            // Get all floor tiles
            getAllFloorTiles() {
                const tiles = [];
                const gameState = GameState.get();
                
                for (let y = 0; y < CONFIG.DUNGEON_HEIGHT; y++) {
                    for (let x = 0; x < CONFIG.DUNGEON_WIDTH; x++) {
                        if (gameState.dungeon[y][x] === CONFIG.SYMBOLS.floor) {
                            tiles.push({ x, y });
                        }
                    }
                }
                return tiles;
            },
            
            // Calculate Manhattan distance between two points
            manhattanDistance(x1, y1, x2, y2) {
                return Math.abs(x1 - x2) + Math.abs(y1 - y2);
            },
            
            // Check if position is valid (within bounds and not a wall)
            isValidPosition(x, y) {
                if (x < 0 || x >= CONFIG.DUNGEON_WIDTH || y < 0 || y >= CONFIG.DUNGEON_HEIGHT) {
                    return false;
                }
                return GameState.getTileAt(x, y) === CONFIG.SYMBOLS.floor;
            },
            
            // Check if position is occupied by another entity
            isPositionOccupied(x, y, excludePlayer = false) {
                const gameState = GameState.get();
                
                if (!excludePlayer && x === gameState.player.x && y === gameState.player.y) {
                    return true;
                }
                
                if (gameState.monsters.some(m => m.x === x && m.y === y)) {
                    return true;
                }
                
                return false;
            },

            // Add this method to Utils object
            getMonsterForFloor(floor) {
                const db = CONFIG.MONSTER_DATABASE;
                
                // Find which tier this floor belongs to
                const tier = db.tiers.find(t => t.floors.includes(floor));
                if (!tier) {
                    // Fallback to last tier if floor is beyond defined tiers
                    const lastTier = db.tiers[db.tiers.length - 1];
                    return this.randomElement(lastTier.monsters);
                }
                
                // Return random monster from this tier
                return this.randomElement(tier.monsters);
            },

            // NEW scaleMonsterStats()      
            scaleMonsterStats(baseMonster, floor) {
                const scaling = CONFIG.MONSTER_DATABASE.scaling;
                return {
                    name: baseMonster.name,
                    symbol: baseMonster.symbol,
                    hp: Math.min(50, Math.floor(baseMonster.baseHp * Math.pow(scaling.hpPerFloor, floor - 1))),
                    maxHp: Math.min(50, Math.floor(baseMonster.baseHp * Math.pow(scaling.hpPerFloor, floor - 1))),
                    damage: Math.max(1, Math.floor(baseMonster.baseDamage * Math.pow(scaling.damagePerFloor, floor - 1))),
                    xp: Math.floor(baseMonster.baseXp * Math.pow(scaling.xpPerFloor, floor - 1))
                };
            }       
        };

        // User Interface management
        const UI = {
            // Update the entire display
            updateDisplay() {
                this.updateDungeon();
                this.updateStats();
                this.updateMessages();
            },

            // NEW Update the dungeon view 6/19
            updateDungeon() {
                const dungeonElement = document.getElementById('dungeon');
                const gameState = GameState.get();
                let html = '';
                
                for (let y = 0; y < CONFIG.DUNGEON_HEIGHT; y++) {
                    let row = '';
                    for (let x = 0; x < CONFIG.DUNGEON_WIDTH; x++) {
                        let symbol = gameState.dungeon[y][x];
                        let cssClass = '';
                        
                        // Check for entities at this position
                        if (x === gameState.player.x && y === gameState.player.y) {
                            symbol = CONFIG.SYMBOLS.player;
                            cssClass = 'player';
                        } else if (gameState.stairs.down && x === gameState.stairs.down.x && y === gameState.stairs.down.y) {
                            symbol = CONFIG.SYMBOLS.stairsDown;
                            cssClass = 'stairs';
                        } else if (gameState.stairs.up && x === gameState.stairs.up.x && y === gameState.stairs.up.y) {
                            symbol = CONFIG.SYMBOLS.stairsUp;
                            cssClass = 'stairs';
                        } else if (gameState.memoryBook && x === gameState.memoryBook.x && y === gameState.memoryBook.y) {
                            symbol = CONFIG.SYMBOLS.memoryBook;
                            cssClass = 'special-item';
                        } else {
                            const monster = gameState.monsters.find(m => m.x === x && m.y === y);
                            if (monster) {
                                symbol = monster.symbol;
                                cssClass = 'monster';
                            } else {
                                const treasure = gameState.treasures.find(t => t.x === x && t.y === y);
                                if (treasure) {
                                    symbol = CONFIG.SYMBOLS.treasure;
                                    cssClass = 'treasure';
                                } else if (symbol === CONFIG.SYMBOLS.wall) {
                                    cssClass = 'wall';
                                } else if (symbol === CONFIG.SYMBOLS.floor) {
                                    cssClass = 'floor';
                                }
                            }
                            if (x === gameState.player.x && y === gameState.player.y && gameState.player.alive) {
                                symbol = CONFIG.SYMBOLS.player;
                                cssClass = 'player';
                            }
                        }
                        
                        if (cssClass) {
                            row += `<span class="${cssClass}">${symbol}</span>`;
                        } else {
                            row += symbol;
                        }
                    }
                    html += '<div class="dungeon-row">' + row + '</div>';
                }
                
                dungeonElement.innerHTML = html;
            },

            // Update character stats display
            updateStats() {
                const player = GameState.getPlayer();
                const depth = GameState.getDepth();
                
                document.getElementById('player-name').textContent = player.name;
                document.getElementById('player-level').textContent = player.level;
                document.getElementById('player-hp').textContent = player.hp;
                document.getElementById('player-max-hp').textContent = player.maxHp;
                document.getElementById('player-xp').textContent = player.xp;
                document.getElementById('player-gold').textContent = player.gold;
                document.getElementById('dungeon-depth').textContent = depth;
                document.getElementById('weapon').textContent = player.weapon;
                document.getElementById('armor').textContent = player.armor;
            },
            
            // Update message log
            updateMessages() {
                const logElement = document.getElementById('message-log');
                const messages = GameState.getMessages();
                
                logElement.innerHTML = messages.map(msg => 
                    `<div class="message${msg.special ? ' special-message' : ''}">${msg.text}</div>`
                ).join('');
                logElement.scrollTop = logElement.scrollHeight;
            },
            
            // Add a message to the log
            addMessage(message, isSpecial = false) {
                GameState.addMessage(message, isSpecial);
                this.updateMessages();
            }
        };

        // Dungeon generation system
        const Dungeon = {
            // Generate a new dungeon level
            generate() {
                this.createEmptyDungeon();
                const rooms = this.generateRooms();
                this.connectRooms(rooms);
                this.placeStairs();
                this.placeMonsters();
                this.placeTreasures();
                this.placeMemoryBook();
            },
            
            // Create empty dungeon filled with walls
            createEmptyDungeon() {
                const dungeon = Array(CONFIG.DUNGEON_HEIGHT).fill().map(() => 
                    Array(CONFIG.DUNGEON_WIDTH).fill(CONFIG.SYMBOLS.wall)
                );
                GameState.setDungeon(dungeon);
            },
            
            // Generate rooms using simple algorithm
            generateRooms() {
                const rooms = [];
                const maxAttempts = CONFIG.GENERATION.ROOMS_PER_LEVEL * 3;
                
                for (let attempt = 0; attempt < maxAttempts && rooms.length < CONFIG.GENERATION.ROOMS_PER_LEVEL; attempt++) {
                    const room = this.createRandomRoom();
                    if (room && !this.roomOverlapsExisting(room, rooms)) {
                        rooms.push(room);
                        this.carveRoom(room);
                    }
                }
                
                return rooms;
            },
            
            // Create a random room
            createRandomRoom() {
                const width = Utils.randomInt(CONFIG.GENERATION.MIN_ROOM_WIDTH, CONFIG.GENERATION.MAX_ROOM_WIDTH);
                const height = Utils.randomInt(CONFIG.GENERATION.MIN_ROOM_HEIGHT, CONFIG.GENERATION.MAX_ROOM_HEIGHT);
                const x = Utils.randomInt(1, CONFIG.DUNGEON_WIDTH - width - 2);
                const y = Utils.randomInt(1, CONFIG.DUNGEON_HEIGHT - height - 2);
                
                return { x, y, width, height };
            },
            
            // Check if room overlaps with existing rooms
            roomOverlapsExisting(room, existingRooms) {
                return existingRooms.some(existingRoom => 
                    Utils.rectanglesOverlap(room, existingRoom)
                );
            },
            
            // Carve out a room (turn walls into floors)
            carveRoom(room) {
                const dungeon = GameState.getDungeon();
                for (let y = room.y; y < room.y + room.height; y++) {
                    for (let x = room.x; x < room.x + room.width; x++) {
                        dungeon[y][x] = CONFIG.SYMBOLS.floor;
                    }
                }
            },
            
            // Connect rooms with corridors
            connectRooms(rooms) {
                for (let i = 1; i < rooms.length; i++) {
                    this.createCorridor(rooms[i-1], rooms[i]);
                }
            },
            
            // Create corridor between two rooms
            createCorridor(room1, room2) {
                const x1 = Math.floor(room1.x + room1.width / 2);
                const y1 = Math.floor(room1.y + room1.height / 2);
                const x2 = Math.floor(room2.x + room2.width / 2);
                const y2 = Math.floor(room2.y + room2.height / 2);
                
                // Horizontal corridor
                const startX = Math.min(x1, x2);
                const endX = Math.max(x1, x2);
                this.carveLine(startX, y1, endX, y1, true);
                
                // Vertical corridor
                const startY = Math.min(y1, y2);
                const endY = Math.max(y1, y2);
                this.carveLine(x2, startY, x2, endY, false);
            },
            
            // Carve a line (corridor)
            carveLine(x1, y1, x2, y2, horizontal) {
                const dungeon = GameState.getDungeon();
                
                if (horizontal) {
                    for (let x = x1; x <= x2; x++) {
                        if (y1 >= 0 && y1 < CONFIG.DUNGEON_HEIGHT && x >= 0 && x < CONFIG.DUNGEON_WIDTH) {
                            dungeon[y1][x] = CONFIG.SYMBOLS.floor;
                        }
                    }
                } else {
                    for (let y = y1; y <= y2; y++) {
                        if (y >= 0 && y < CONFIG.DUNGEON_HEIGHT && x1 >= 0 && x1 < CONFIG.DUNGEON_WIDTH) {
                            dungeon[y][x1] = CONFIG.SYMBOLS.floor;
                        }
                    }
                }
            },
            
            // Place stairs
            placeStairs() {
                const emptyTiles = Utils.getEmptyFloorTiles();
                const stairs = { down: null, up: null };
                
                if (emptyTiles.length >= 1) {
                    // Place down stairs (only if not on maximum depth)
                    if (GameState.getDepth() < 40) {
                        const downPos = Utils.randomElement(emptyTiles);
                        stairs.down = downPos;
                    }
                    
                    // Place up stairs (if not on first level)
                    if (GameState.getDepth() > 1) {
                        const upPos = Utils.randomElement(emptyTiles.filter(tile => 
                            !stairs.down || (tile.x !== stairs.down.x || tile.y !== stairs.down.y)
                        ));
                        stairs.up = upPos;
                    }
                }
                
                GameState.setStairs(stairs);
            },

            // Place monsters - FIXED VERSION
            placeMonsters() {
                const emptyTiles = Utils.getEmptyFloorTiles();
                const monsters = [];
                const numMonsters = Utils.randomInt(
                    CONFIG.GENERATION.MIN_MONSTERS, 
                    CONFIG.GENERATION.MAX_MONSTERS
                );

                for (let i = 0; i < numMonsters && emptyTiles.length > 0; i++) {
                    const pos = emptyTiles.splice(Utils.randomInt(0, emptyTiles.length - 1), 1)[0];
                    
                    // Get monster type for current floor and scale its stats
                    const baseMonster = Utils.getMonsterForFloor(GameState.getDepth());
                    const scaledMonster = Utils.scaleMonsterStats(baseMonster, GameState.getDepth());
                    
                    monsters.push({
                        x: pos.x, 
                        y: pos.y,
                        name: scaledMonster.name,
                        symbol: scaledMonster.symbol,
                        hp: scaledMonster.hp,
                        maxHp: scaledMonster.maxHp,
                        damage: scaledMonster.damage,
                        xp: scaledMonster.xp
                    });
                }
                
                GameState.setMonsters(monsters);
            },
                       
            // Place treasures
            placeTreasures() {
                const emptyTiles = Utils.getEmptyFloorTiles();
                const treasures = [];
                const numTreasures = Utils.randomInt(
                    CONFIG.GENERATION.MIN_TREASURES, 
                    CONFIG.GENERATION.MAX_TREASURES
                );
                
                for (let i = 0; i < numTreasures && emptyTiles.length > 0; i++) {
                    const pos = emptyTiles.splice(Utils.randomInt(0, emptyTiles.length - 1), 1)[0];
                    const gold = Utils.randomInt(10, 60);
                    
                    treasures.push({
                        x: pos.x, 
                        y: pos.y,
                        gold: gold
                    });
                }
                
                GameState.setTreasures(treasures);
            },
            
            // Place the memory book (only appears on levels 15-25)
            placeMemoryBook() {
                const depth = GameState.getDepth();
                const player = GameState.getPlayer();
                
                // Only place the book if player hasn't recovered memory and is in the right depth range
                if (!player.hasMemory && depth >= 15 && depth <= 25) {
                    // 30% chance to place the book on any eligible level
                    if (Math.random() < 0.3) {
                        const emptyTiles = Utils.getEmptyFloorTiles();
                        if (emptyTiles.length > 0) {
                            const pos = Utils.randomElement(emptyTiles);
                            GameState.setMemoryBook({
                                x: pos.x,
                                y: pos.y,
                                title: "Journal of Adventures Past"
                            });
                        }
                    }
                }
            }
        };

        // Player management system
        const Player = {
            // Initialize player position
            initialize() {
                const floorTiles = Utils.getAllFloorTiles();
                if (floorTiles.length > 0) {
                    const pos = Utils.randomElement(floorTiles);
                    GameState.setPlayerPosition(pos.x, pos.y);
                }
            },

            // NEW Player.move()
            move(dx, dy) {
                const player = GameState.getPlayer();
                const newX = player.x + dx;
                const newY = player.y + dy;
                
                // Check boundaries
                if (newX < 0 || newX >= CONFIG.DUNGEON_WIDTH || newY < 0 || newY >= CONFIG.DUNGEON_HEIGHT) {
                    UI.addMessage("You bump into a wall.");
                    return false;
                }
                
                // Check for walls
                if (GameState.getTileAt(newX, newY) === CONFIG.SYMBOLS.wall) {
                    UI.addMessage("You bump into a wall.");
                    return false;
                }
                
                // Check for monsters - attack instead of moving
                const monster = GameState.getMonsterAt(newX, newY);
                if (monster) {
                    GameState.state.inCombat = true; // Lock monster movement
                    const monsterKilled = this.attackMonster(monster);
                    return 'combat';
                }
                
                // Move player
                GameState.setPlayerPosition(newX, newY);
                GameState.state.inCombat = false; // End combat if moving away
                
                // Check for treasures, memory book, stairs (unchanged)
                const treasure = GameState.getTreasureAt(newX, newY);
                if (treasure) {
                    player.gold += treasure.gold;
                    GameState.removeTreasure(treasure);
                    UI.addMessage(`You found ${treasure.gold} gold!`);
                }
                
                const memoryBook = GameState.getMemoryBookAt(newX, newY);
                if (memoryBook) {
                    this.discoverMemory();
                    GameState.removeMemoryBook();
                }
                
                const stairs = GameState.getStairs();
                if (stairs.down && newX === stairs.down.x && newY === stairs.down.y) {
                    UI.addMessage("You see stairs leading down into darkness. Press '>' to descend.");
                } else if (stairs.up && newX === stairs.up.x && newY === stairs.up.y) {
                    UI.addMessage("You see stairs leading up. Press '<' to ascend.");
                }
                
                return true;
            },

            // NEW attackMonster() 6/19
            attackMonster(monster) {
                const player = GameState.getPlayer();
                const playerDamage = Utils.randomInt(1, 4) + (player.level - 1);
                
                monster.hp -= playerDamage;
                console.log(`Monster ${monster.name} HP: ${monster.hp} at (${monster.x}, ${monster.y})`);
                UI.addMessage(`You attack the ${monster.name} for ${playerDamage} damage! (HP: ${monster.hp})`);
                
                if (monster.hp <= 0) {
                    UI.addMessage(`The ${monster.name} dies!`);
                    player.xp += monster.xp;
                    player.gold += Utils.randomInt(5, 15);
                    GameState.removeMonster(monster);
                    GameState.state.inCombat = false;
                    this.checkLevelUp();
                    return true;
                } else {
                    const monsterDamage = Math.max(1, Utils.randomInt(1, monster.damage));
                    player.hp -= monsterDamage;
                    console.log(`Player HP: ${player.hp} after ${monsterDamage} damage`);
                    UI.addMessage(`The ${monster.name} attacks you for ${monsterDamage} damage!`);
                    
                    if (player.hp <= 0) {
                        this.handleDeath();
                        GameState.state.inCombat = false;
                        return false;
                    }
                    return false;
                }
            },

            // Check if player should level up
            checkLevelUp() {
                const player = GameState.getPlayer();
                const xpNeeded = player.level * 100;
                
                if (player.xp >= xpNeeded) {
                    player.level++;
                    player.xp -= xpNeeded;
                    const hpGain = Utils.randomInt(3, 8);
                    player.maxHp += hpGain;
                    player.hp = player.maxHp; // Full heal on level up
                    
                    UI.addMessage(`Level up! You are now level ${player.level}!`, true);
                    UI.addMessage(`You gained ${hpGain} hit points!`);
                    
                    // Upgrade equipment occasionally
                    if (player.level === 3 && player.weapon === 'Dagger') {
                        player.weapon = 'Short Sword';
                        UI.addMessage("You've mastered the use of a Short Sword!");
                    } else if (player.level === 5 && player.armor === 'Cloth') {
                        player.armor = 'Leather Armor';
                        UI.addMessage("You've acquired Leather Armor!");
                    } else if (player.level === 8 && player.weapon === 'Short Sword') {
                        player.weapon = 'Long Sword';
                        UI.addMessage("You've found a fine Long Sword!");
                    } else if (player.level === 10 && player.armor === 'Leather Armor') {
                        player.armor = 'Chain Mail';
                        UI.addMessage("You've obtained Chain Mail armor!");
                    }
                }
            },

            // NEW Handle player death 9/19
            handleDeath() {
                const player = GameState.getPlayer();
                player.alive = false;
                UI.addMessage("You have died!", true);
                UI.addMessage(`Final Score: Level ${player.level}, Depth ${GameState.getDepth()}, Gold ${player.gold}`, true);
                UI.addMessage("Press Enter to restart the game.", true);
            },

            // Discover memory (when finding the book)
            discoverMemory() {
                const player = GameState.getPlayer();
                if (!player.hasMemory) {
                    player.hasMemory = true;
                    player.name = 'Bryan';
                    
                    UI.addMessage("You pick up an old, leather-bound journal...", true);
                    UI.addMessage("As you open it, memories flood back!", true);
                    UI.addMessage("The journal is yours - you remember now!", true);
                    UI.addMessage("Your name is Bryan, and you were once a great adventurer!", true);
                    UI.addMessage("You came here seeking the legendary treasure of Moria...", true);
                    UI.addMessage("But something went wrong, and you lost your memory.", true);
                    UI.addMessage("Now you remember your quest - find the treasure at the deepest level!", true);
                }
            },
            
            // Rest to restore health
            rest() {
                const player = GameState.getPlayer();
                if (player.hp >= player.maxHp) {
                    UI.addMessage("You are already at full health.");
                    return;
                }
                
                const healAmount = Utils.randomInt(1, 2);
                player.hp = Math.min(player.maxHp, player.hp + healAmount);
                UI.addMessage(`You rest and recover ${healAmount} hit points.`);
                
                // Monsters might move while resting
                AI.moveMonsters();
            },
            
            // Use stairs
            useStairs(direction) {
                const player = GameState.getPlayer();
                const stairs = GameState.getStairs();
                
                if (direction === 'down') {
                    if (stairs.down && player.x === stairs.down.x && player.y === stairs.down.y) {
                        GameState.incrementDepth();
                        UI.addMessage(`You descend to level ${GameState.getDepth()}...`, true);
                        Game.generateNewLevel();
                        return true;
                    } else {
                        UI.addMessage("There are no stairs down here.");
                    }
                } else if (direction === 'up') {
                    if (stairs.up && player.x === stairs.up.x && player.y === stairs.up.y) {
                        if (GameState.getDepth() > 1) {
                            GameState.decrementDepth();
                            UI.addMessage(`You ascend to level ${GameState.getDepth()}...`);
                            Game.generateNewLevel();
                            return true;
                        } else {
                            UI.addMessage("You emerge into sunlight. You have escaped the dungeon!", true);
                            UI.addMessage(`Final Score: Level ${player.level}, Gold ${player.gold}`, true);
                            UI.addMessage("Press R to restart for another adventure.", true);
                        }
                    } else {
                        UI.addMessage("There are no stairs up here.");
                    }
                }
                return false;
            }
        };

        // Monster AI system
        const AI = {
            // NEW moveMonsters()            
            moveMonsters() {
                const monsters = GameState.getMonsters();
                const player = GameState.getPlayer();
                
                monsters.forEach(monster => {
                    const distance = Utils.manhattanDistance(monster.x, monster.y, player.x, player.y);
                    // Skip movement if in combat or adjacent
                    if (GameState.state.inCombat || distance <= 1) {
                        return;
                    }
                    if (distance <= 5 && Math.random() < 0.5) {
                        this.moveMonsterTowardPlayer(monster, player);
                    } else if (Math.random() < 0.3) {
                        this.moveMonsterRandomly(monster);
                    }
                });
            },
            // Move monster toward player
            moveMonsterTowardPlayer(monster, player) {
                const dx = player.x - monster.x;
                const dy = player.y - monster.y;
                
                let moveX = 0, moveY = 0;
                
                if (Math.abs(dx) > Math.abs(dy)) {
                    moveX = dx > 0 ? 1 : -1;
                } else {
                    moveY = dy > 0 ? 1 : -1;
                }
                
                const newX = monster.x + moveX;
                const newY = monster.y + moveY;
                
                // Check if move is valid and position is not occupied
                if (Utils.isValidPosition(newX, newY) && 
                    !Utils.isPositionOccupied(newX, newY, true)) {
                    monster.x = newX;
                    monster.y = newY;
                }
            },
            
            // Move monster randomly
            moveMonsterRandomly(monster) {
                const directions = [
                    { x: -1, y: 0 }, { x: 1, y: 0 },
                    { x: 0, y: -1 }, { x: 0, y: 1 }
                ];
                
                const direction = Utils.randomElement(directions);
                const newX = monster.x + direction.x;
                const newY = monster.y + direction.y;
                
                if (Utils.isValidPosition(newX, newY) && 
                    !Utils.isPositionOccupied(newX, newY, true)) {
                    monster.x = newX;
                    monster.y = newY;
                }
            }
        };

        /* NEW setupEventListeners() 6/22 */
        // Main game controller
        const Game = {
            // Initialize the game
            init() {
                GameState.reset();
                this.generateNewLevel();
                Player.initialize();
                UI.updateDisplay();
                // Remove this.setupEventListeners() from init
                // Initial messages
                UI.addMessage("You awaken in darkness, your memory foggy...");
                UI.addMessage("Who are you? Why are you here?");
                UI.addMessage("Perhaps the answers lie deeper in the dungeon...");
            },
            
            // Generate a new dungeon level
            generateNewLevel() {
                Dungeon.generate();
                const stairs = GameState.getStairs();
                if (stairs.up) {
                    GameState.setPlayerPosition(stairs.up.x, stairs.up.y);
                } else {
                    Player.initialize();
                }
            },
            
            // NEW Setup event listeners 6/22
            setupEventListeners() {
                let lastProcessed = 0;
                const DEBOUNCE_MS = 100;

                document.addEventListener('keydown', (event) => {
                    if (GameState.state.gameActive){
                        event.preventDefault(); // Prevent browser defaults for all keys
                    }
                    
                    const now = Date.now();
                    if (now - lastProcessed < DEBOUNCE_MS) return;

                    const player = GameState.getPlayer();
                    
                    if (player.hp <= 0 || !player.alive) {
                        if (event.key === 'Enter') {
                            lastProcessed = now;
                            this.init();
                            UI.addMessage("Game restarted!");
                        }
                        return;
                    }
                    
                    let actionResult = false;
                    lastProcessed = now;
                    
                    switch(event.key.toLowerCase()) {
                        case 'arrowup':
                        case 'w':
                            actionResult = Player.move(0, -1);
                            break;
                        case 'arrowdown':
                        case 's':
                            actionResult = Player.move(0, 1);
                            break;
                        case 'arrowleft':
                        case 'a':
                            actionResult = Player.move(-1, 0);
                            break;
                        case 'arrowright':
                        case 'd':
                            actionResult = Player.move(1, 0);
                            break;
                        case '>':
                        case '.':
                            actionResult = Player.useStairs('down');
                            break;
                        case '<':
                        case ',':
                            actionResult = Player.useStairs('up');
                            break;
                        case 'r':
                            Player.rest();
                            actionResult = true;
                            break;
                        case 'i':
                            UI.addMessage("Inventory system not yet implemented.");
                            break;
                        default:
                            return; // Skip processing but preventDefault already called
                    }

                    if (actionResult) {
                        if (actionResult === true && !GameState.state.inCombat) {
                            AI.moveMonsters();
                        }
                        UI.updateDisplay();
                    }
                });
            },

            // Start the game
            start() {
                this.setupEventListeners(); // Move event listener setup here
                this.init();
            }
        };

        // Start the game when page loads
        window.addEventListener('load', () => {
            Game.start();
        });

        function activeScreen() {
            if (GameState.state.currentScreen == "dungeon") {
                gameContainerDiv.style.display = "flex";
                createCharacterDiv.style.display = "none";
                UI.updateDisplay();
            }
        }

        function createCharacter() {
            GameState.state.gameActive = true;
            GameState.state.currentScreen = "dungeon";
            GameState.state.player.name = newCharacterName.value;
            activeScreen();
        }