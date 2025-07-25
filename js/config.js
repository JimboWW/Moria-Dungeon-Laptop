        const CONFIG = {
            DUNGEON_WIDTH: 80,
            DUNGEON_HEIGHT: 24,
            
            // Symbols used in the game
            SYMBOLS: {
                player: '@',
                wall: '#',
                floor: '.',
                monster: 'M',
                treasure: '$',
                stairsDown: '>',
                stairsUp: '<',
                empty: ' ',
                memoryBook: '?'
            },

            // Generation parameters
            GENERATION: {
                ROOMS_PER_LEVEL: 8,
                MIN_ROOM_WIDTH: 4,
                MAX_ROOM_WIDTH: 12,
                MIN_ROOM_HEIGHT: 3,
                MAX_ROOM_HEIGHT: 9,
                MIN_MONSTERS: 3,
                MAX_MONSTERS: 11,
                MIN_TREASURES: 2,
                MAX_TREASURES: 7
            },
            
            // Player stats
            PLAYER_DEFAULTS: {
                hp: 20,
                maxHp: 20,
                level: 1,
                xp: 0,
                gold: 0,
                weapon: 'Dagger',
                armor: 'Cloth',
                name: 'Unknown',
                hasMemory: false
            },

           // Add this to CONFIG object
            MONSTER_DATABASE: {

                // Floors 1-5: Vermin and small creatures
                tiers: [
                    {
                        floors: [1, 2, 3, 4, 5],
                        monsters: [
                            { name: 'Mouse', symbol: 'm', baseHp: 4, baseDamage: 4, baseXp: 5 },
                            { name: 'Fly', symbol: 'f', baseHp: 3, baseDamage: 2, baseXp: 3 },
                            { name: 'Worm', symbol: 'w', baseHp: 4, baseDamage: 3, baseXp: 4 },
                            { name: 'Rat', symbol: 'r', baseHp: 6, baseDamage: 5, baseXp: 8 }
                        ]
                    },

                    // Floors 6-10: Small humanoids
                    {
                        floors: [6, 7, 8, 9, 10],
                        monsters: [
                            { name: 'Rat', symbol: 'r', baseHp: 7, baseDamage: 5, baseXp: 8 },
                            { name: 'Goblin', symbol: 'g', baseHp: 12, baseDamage: 7, baseXp: 12 },
                            { name: 'Kobold', symbol: 'k', baseHp: 10, baseDamage: 6, baseXp: 10 }
                        ]
                    },
                    // We can add more tiers later, but let's test with just these two first
                ],
                
                // Scaling factors - how much stats increase per floor
                scaling: {
                    hpPerFloor: 1.15,     // 15% HP increase per floor
                    damagePerFloor: 1.10, // 10% damage increase per floor  
                    xpPerFloor: 1.15     // 15% XP increase per floor
                }
            }            
        };