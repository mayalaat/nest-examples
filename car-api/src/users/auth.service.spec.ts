import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of the Users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('email@mail.com', 'pass');

    expect(user.password).not.toEqual('password');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw an exception if user signs up with email that is in use. Try-catch way', async () => {
    await service.signUp('email@mail.com', 'pass');

    try {
      await service.signUp('email@mail.com', 'pass');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('email in use');
    }
  });

  it('throw an exception if user signs up with email that is in use. Rejects way', async () => {
    await service.signUp('email@mail.com', 'pass');
    expect.assertions(1);
    await expect(
      service.signUp('email@mail.com', 'pass'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws if signIn is called with an unused email', async () => {
    expect.assertions(1);
    await expect(service.signIn('asdflkj@asdlfkj.com', 'pass')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('email@mail.com', 'incorrect_password');

    expect.assertions(1);
    await expect(service.signIn('email@mail.com', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp('email@mail.com', 'pass');

    const user = await service.signIn('email@mail.com', 'pass');

    expect(user).toBeDefined();
  });
});
