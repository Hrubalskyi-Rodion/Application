import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../events/event.entity';
import { User } from '../../users/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.eventsRepository.find({
      where: { visibility: 'public' },
      relations: ['organizer', 'participants'],
    });
  }

  async findOne(id: number) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CreateEventDto, userId: number) {
    const organizer = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!organizer) throw new NotFoundException('User not found');

    const event = this.eventsRepository.create({
      ...dto,
      date: new Date(dto.date),
      organizer,
    });
    return this.eventsRepository.save(event);
  }

  async update(id: number, dto: UpdateEventDto, userId: number) {
    const event = await this.findOne(id);
    if (event.organizer.id !== userId)
      throw new ForbiddenException('Not your event');
    Object.assign(event, dto);
    return this.eventsRepository.save(event);
  }

  async delete(id: number, userId: number) {
    const event = await this.findOne(id);
    if (event.organizer.id !== userId)
      throw new ForbiddenException('Not your event');
    await this.eventsRepository.remove(event);
    return { message: 'Event deleted' };
  }

  async join(eventId: number, userId: number) {
    const event = await this.findOne(eventId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (event.capacity && event.participants.length >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const alreadyJoined = event.participants.some((p) => p.id === userId);
    if (alreadyJoined) throw new BadRequestException('Already joined');

    event.participants.push(user);
    return this.eventsRepository.save(event);
  }

  async leave(eventId: number, userId: number) {
    const event = await this.findOne(eventId);
    event.participants = event.participants.filter((p) => p.id !== userId);
    return this.eventsRepository.save(event);
  }

  async findUserEvents(userId: number) {
    return this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .where('organizer.id = :userId', { userId })
      .orWhere('participants.id = :userId', { userId })
      .getMany();
  }
}
