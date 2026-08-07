import 'dotenv/config';
import { query } from './db.js';
import bcrypt from 'bcryptjs';

const items_mock = [
    {
        name: "Matura",
        observations: "Una n-are coada",
        location: "EC 004",
        category: "Curatenie",
        quantity: 2
    },
    {
        name: "Faras",
        location: "EC 004",
        category: "Curatenie",
        quantity: 2
    },
    {
        name: "Foi A4",
        location: "EC 105",
        category: "Birotica",
        quantity: 2,
        quantity_measurement: "topuri"
    },
    {
        name: "Pixuri",
        location: "EC 105",
        category: "Birotica",
        quantity: 45
    },
    {
        name: "FC23",
        location: "Precis",
        category: "Diverse",
        quantity: 3
    },
    {
        name: "XBOX One",
        location: "Precis",
        category: "Diverse",
        quantity: 1
    },
    {
        name: "Cutite",
        location: "P16",
        category: "Bucatarie",
        quantity: 50,
        is_quantity_aproximation: true
    },
    {
        name: "Cola 2L",
        location: "P16",
        category: "Bar",
        quantity: 3,
        quantity_measurement: "bax",
        is_quantity_aproximation: true
    }
]

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
]

async function seed_users() {
    try {
        await query('TRUNCATE TABLE users RESTART IDENTITY;');

        for (const usr of users_mock) {
            const passHash = await bcrypt.hash(usr.password, 10);
            await query('INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)', 
                [usr.first_name, usr.last_name, usr.email, passHash, usr.role])
        }
        console.log('Successfully seeded mock users');
    } catch (err) {
        console.log('Sth went wrong seeding users: ', err);
        process.exit(1);
    }
    
}

async function seed_objects() {
    try {
        await query('TRUNCATE TABLE objects RESTART IDENTITY;');

        for (const obj of items_mock) {
            try{
                await query(
                `INSERT INTO objects (
                name, 
                observations, 
                location, 
                image_url, 
                source_url, 
                category, 
                quantity, 
                quantity_measurement, 
                is_quantity_aproximation
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                obj.name,
                obj.observations || null,
                obj.location,
                obj.image_url || null,
                obj.source_url || null,
                obj.category,
                obj.quantity !== undefined ? obj.quantity : null,
                obj.quantity_measurement || null,
                obj.is_quantity_aproximation || false,
                ]
                );
                console.log("inserted: ", obj.name);
            } catch(itErr) {
                console.log("couldnt add", obj.name, "because: ", itErr);
            }
                
        }
        console.log('Successfully seeded mock objects');
    } catch (err) {
        console.log('Sth went wrong seeding objects: ', err);
        process.exit(1);
    }
}

async function seed_all() {
    await seed_users();
    await seed_objects();
}

seed_all();