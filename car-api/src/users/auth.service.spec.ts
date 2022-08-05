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
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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

    expect(user.password).not.toEqual('pass');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw an exception if user signs up with email that is in use. Try-catch way', async () => {
    const fakeUser = { id: 1, email: '', password: '' } as User;
    fakeUsersService.find = () => Promise.resolve([fakeUser]);

    try {
      await service.signUp('email@mail.com', 'pass');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('email in use');
    }
  });

  it('throw an exception if user signs up with email that is in use. Rejects way', async () => {
    const fakeUser = { id: 1, email: '', password: '' } as User;
    fakeUsersService.find = () => Promise.resolve([fakeUser]);

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
    const fakeUser = { email: 'email@mail.com', password: 'pass' } as User;
    fakeUsersService.find = () => Promise.resolve([fakeUser]);

    expect.assertions(1);
    await expect(service.signIn('email@mail.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'email@mail.com',
          password:
            '164c937274fdfb43.eef6114c3e7b9e3b367f2449a1c7f3901e0828d87bd7d405d748df7fd736f98a',
        } as User,
      ]);

    const user = await service.signIn('email@mail.com', 'pass');

    expect(user).toBeDefined();
  });
});
