import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres123',
  database: 'events_db',
  entities: [User, Event],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const eventRepo = AppDataSource.getRepository(Event);

  const password = await bcrypt.hash('password123', 10);

  const user1 = userRepo.create({
    name: 'Alice',
    email: 'alice@test.com',
    password,
  });
  const user2 = userRepo.create({
    name: 'Bob',
    email: 'bob@test.com',
    password,
  });
  await userRepo.save([user1, user2]);

  const event1 = eventRepo.create({
    title: 'Tech Conference 2026',
    description:
      'Annual technology conference featuring the latest innovations in AI.',
    date: new Date('2026-04-15T09:00:00'),
    location: 'Convention Center, Kyiv',
    capacity: 500,
    visibility: 'public',
    organizer: user1,
    participants: [],
  });

  const event2 = eventRepo.create({
    title: 'Community Networking Meetup',
    description: 'Connect with local professionals and expand your network.',
    date: new Date('2026-04-20T18:30:00'),
    location: 'Downtown Coffee Shop, Lviv',
    capacity: 30,
    visibility: 'public',
    organizer: user2,
    participants: [],
  });

  const event3 = eventRepo.create({
    title: 'Design Workshop',
    description: 'Hands-on workshop covering modern UI/UX design principles.',
    date: new Date('2026-04-25T14:00:00'),
    location: 'Creative Space Studio, Kharkiv',
    capacity: 20,
    visibility: 'public',
    organizer: user1,
    participants: [],
  });

  await eventRepo.save([event1, event2, event3]);

  console.log('Seeding completed!');
  await AppDataSource.destroy();
}

seed().catch(console.error);
