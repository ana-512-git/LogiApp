import 'dotenv/config';
import { query } from './db.js';
import bcrypt from 'bcryptjs';

const items_mock = [
    // 1. Bar Category
    {
        name: "Espresso Coffee Beans 1kg",
        observations: "Arabica 100%, check roast date on bag",
        source_url: "https://example.com/coffee-beans",
        category: "Bar",
        stocks: [
            { location: "EC 105", quantity: 4.5, quantity_measurement: "kg", is_quantity_aproximation: false },
            { location: "Precis", quantity: 2.0, quantity_measurement: "kg", is_quantity_aproximation: true },
            { location: "P16", quantity: 10, quantity_measurement: "kg", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Oat Milk (Barista Edition)",
        observations: "Requires refrigeration after opening. Check expiration date.",
        category: "Bar",
        stocks: [
            { location: "EC 105", quantity: 12, quantity_measurement: "pachet", is_quantity_aproximation: false },
            { location: "EC 004", quantity: 6, quantity_measurement: "pachet", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Monin Vanilla Syrup 1L",
        observations: "For special coffee drinks",
        source_url: "https://example.com/syrup-vanilla",
        category: "Bar",
        stocks: [
            { location: "EC 105", quantity: 1.5, quantity_measurement: "L", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Paper Cups 250ml",
        observations: "Eco-friendly double wall cups",
        category: "Bar",
        stocks: [
            { location: "EC 105", quantity: 350, quantity_measurement: "buc", is_quantity_aproximation: true },
            { location: "Precis", quantity: 100, quantity_measurement: "buc", is_quantity_aproximation: true }
        ]
    },

    // 2. Bucatarie Category
    {
        name: "Sponge Spoons & Fork Set (50pcs)",
        category: "Bucatarie",
        stocks: [
            { location: "EC 105", quantity: 2, quantity_measurement: "set", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Dishwashing Liquid 5L",
        observations: "Citrus scent. Refill the small bottles near sinks.",
        source_url: "https://example.com/soap-5l",
        category: "Bucatarie",
        stocks: [
            { location: "EC 004", quantity: 15, quantity_measurement: "L", is_quantity_aproximation: false },
            { location: "P16", quantity: 5, quantity_measurement: "L", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Microwave Oven 800W",
        observations: "Clean after heating food with sauce! Contact IT if broken.",
        source_url: "https://example.com/microwave-manual",
        category: "Bucatarie",
        stocks: [
            { location: "EC 105", quantity: 1, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Electric Kettle 1.7L",
        observations: "De-scale with vinegar monthly",
        category: "Bucatarie",
        stocks: [
            { location: "EC 105", quantity: 1, quantity_measurement: "buc", is_quantity_aproximation: false },
            { location: "P16", quantity: 1, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },

    // 3. Curatenie Category
    {
        name: "Microfiber Cleaning Cloths (Pack of 10)",
        observations: "Yellow for kitchen, Blue for offices",
        category: "Curatenie",
        stocks: [
            { location: "EC 004", quantity: 4, quantity_measurement: "pachet", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Trash Bags 120L Heavy Duty",
        observations: "Black rolls",
        source_url: "https://example.com/trash-bags",
        category: "Curatenie",
        stocks: [
            { location: "P16", quantity: 0, quantity_measurement: "rola", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Surface Sanitizer Spray 750ml",
        observations: "Contains 70% alcohol. Do not spray near open flame.",
        category: "Curatenie",
        stocks: [
            { location: "EC 105", quantity: 3, quantity_measurement: "flacon", is_quantity_aproximation: false },
            { location: "Precis", quantity: 1, quantity_measurement: "flacon", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Broom and Dustpan Set",
        observations: "Handle is slightly loose on the P16 one",
        category: "Curatenie",
        stocks: [
            { location: "P16", quantity: 1, quantity_measurement: "set", is_quantity_aproximation: false }
        ]
    },

    // 4. Birotica Category
    {
        name: "Logitech Wireless Mouse MX Master 3S",
        observations: "S/N: 2309US881A. Ergonomic edition.",
        source_url: "https://example.com/mouse-mx3s",
        category: "Birotica",
        stocks: [
            { location: "Precis", quantity: 2, quantity_measurement: "buc", is_quantity_aproximation: false },
            { location: "P16", quantity: 1, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },
    {
        name: "HDMI Cable 3m (4K 60Hz)",
        observations: "Braided cable, high speed",
        category: "Birotica",
        stocks: [
            { location: "EC 105", quantity: 5, quantity_measurement: "buc", is_quantity_aproximation: false },
            { location: "Precis", quantity: 8, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Dell UltraSharp 27\" Monitor",
        observations: "Resolution: 2560x1440. Includes USB-C cable.",
        source_url: "https://example.com/dell-monitor",
        category: "Birotica",
        stocks: [
            { location: "Precis", quantity: 4, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },
    {
        name: "USB-C Multiport Adapter / Hub",
        observations: "HDMI + VGA + 3x USB 3.0",
        category: "Birotica",
        stocks: [
            { location: "EC 105", quantity: 2, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },

    // 5. Papetarie Category
    {
        name: "A4 Copy Paper 80g (500 sheets/pack)",
        observations: "White 160 CIE",
        source_url: "https://example.com/paper-a4",
        category: "Papetarie",
        stocks: [
            { location: "EC 004", quantity: 20, quantity_measurement: "top", is_quantity_aproximation: false },
            { location: "P16", quantity: 8, quantity_measurement: "top", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Sticky Notes 76x76mm Yellow",
        observations: "3M Post-It original",
        category: "Papetarie",
        stocks: [
            { location: "EC 105", quantity: 15.5, quantity_measurement: "pachet", is_quantity_aproximation: true }
        ]
    },
    {
        name: "Ballpoint Pens Blue (Box of 50)",
        observations: "0.7mm tip",
        category: "Papetarie",
        stocks: [
            { location: "EC 004", quantity: 3, quantity_measurement: "cutie", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Whiteboard Markers Set (4 Colors)",
        observations: "Black, Blue, Red, Green. Dry erase only!",
        source_url: "https://example.com/markers-set",
        category: "Papetarie",
        stocks: [
            { location: "EC 105", quantity: 4, quantity_measurement: "set", is_quantity_aproximation: false },
            { location: "Precis", quantity: 2, quantity_measurement: "set", is_quantity_aproximation: false }
        ]
    },

    // 6. Boardgames Category
    {
        name: "Catan (Base Game - Romanian Edition)",
        observations: "Contains 19 terrain tiles, 95 resource cards, 25 dev cards",
        source_url: "https://example.com/catan-ro",
        category: "Boardgames",
        stocks: [
            { location: "P16", quantity: 1, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Codenames (Ro: Nume de Cod)",
        observations: "Word guessing party game",
        category: "Boardgames",
        stocks: [
            { location: "P16", quantity: 2, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Ticket to Ride: Europe",
        observations: "Includes 1 board map, 240 colored train cars, 15 stations",
        source_url: "https://example.com/ticket-to-ride",
        category: "Boardgames",
        stocks: [
            { location: "P16", quantity: 1, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Dixit (Expansion 3 - Journey)",
        observations: "84 new oversized cards",
        category: "Boardgames",
        stocks: [
            { location: "P16", quantity: 1, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },

    // 7. Diverse Category
    {
        name: "First Aid Kit (Standard Office)",
        observations: "Check expiry date of bandages every 6 months!",
        source_url: "https://example.com/first-aid",
        category: "Diverse",
        stocks: [
            { location: "EC 105", quantity: 1, quantity_measurement: "trusa", is_quantity_aproximation: false },
            { location: "P16", quantity: 1, quantity_measurement: "trusa", is_quantity_aproximation: false }
        ]
    },
    {
        name: "Extension Cord 5-Socket 5m",
        observations: "Max load: 3500W. Do not daisy-chain!",
        category: "Diverse",
        stocks: [
            { location: "EC 004", quantity: 6, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    },
    {
        name: "AA Rechargeable Batteries 2500mAh",
        observations: "Keep in charger when not in use",
        category: "Diverse",
        stocks: [
            { location: "EC 105", quantity: 24, quantity_measurement: "buc", is_quantity_aproximation: true }
        ]
    },
    {
        name: "Proiectator LED Portabil 50W",
        observations: "Pliabil cu suport metallic și cablu 3m",
        category: "Diverse",
        stocks: [
            { location: "P16", quantity: 1, quantity_measurement: "buc", is_quantity_aproximation: false }
        ]
    }
];

const users_mock = [
    {
        first_name: "admin1",
        last_name: "admin1",
        email: "admin1@gmail.com",
        password: "password1",
        role: "admin"
    },
    {
        first_name: "admin2",
        last_name: "admin2",
        email: "admin2@gmail.com",
        password: "password2",
        role: "admin"
    },
    {
        first_name: "user1",
        last_name: "user1",
        email: "user1@gmail.com",
        password: "password1",
        role: "staff"
    },
    {
        first_name: "user2",
        last_name: "user2",
        email: "user2@gmail.com",
        password: "password2",
        role: "staff"
    }
];

async function seed_users() {
    try {
        await query('TRUNCATE TABLE users RESTART IDENTITY;');

        for (const usr of users_mock) {
            const passHash = await bcrypt.hash(usr.password, 10);
            await query(
                'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)', 
                [usr.first_name, usr.last_name, usr.email, passHash, usr.role]
            );
        }
        console.log('Successfully seeded mock users');
    } catch (err) {
        console.error('Sth went wrong seeding users: ', err);
        process.exit(1);
    }
}

async function seed_objects() {
    try {
        // Truncating objects cascades and clears object_stock as well
        await query('TRUNCATE TABLE objects, object_stock RESTART IDENTITY CASCADE;');

        for (const obj of items_mock) {
            try {
                // 1. Insert object general details
                const objResult = await query(
                    `INSERT INTO objects (name, observations, source_url, category)
                     VALUES ($1, $2, $3, $4) RETURNING id`,
                    [
                        obj.name,
                        obj.observations || null,
                        obj.source_url || null,
                        obj.category
                    ]
                );

                const createdObjectId = objResult.rows[0].id;

                // 2. Insert vector of stocks for this object
                if (obj.stocks && obj.stocks.length > 0) {
                    for (const stk of obj.stocks) {
                        await query(
                            `INSERT INTO object_stock (object_id, location, quantity, quantity_measurement, is_quantity_aproximation)
                             VALUES ($1, $2, $3, $4, $5)`,
                            [
                                createdObjectId,
                                stk.location,
                                stk.quantity !== undefined ? stk.quantity : null,
                                stk.quantity_measurement || null,
                                stk.is_quantity_aproximation || false
                            ]
                        );
                    }
                }

                console.log("inserted: ", obj.name);
            } catch (itErr) {
                console.error("couldnt add", obj.name, "because: ", itErr);
            }
        }
        console.log('Successfully seeded mock objects & stocks');
    } catch (err) {
        console.error('Sth went wrong seeding objects: ', err);
        process.exit(1);
    }
}

async function seed_all() {
    await seed_users();
    await seed_objects();
}

seed_all();