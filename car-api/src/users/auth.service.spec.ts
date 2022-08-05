import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

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
});
