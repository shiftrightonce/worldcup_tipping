import { AppDataSource } from "../data-source"
import { User } from "../entity/User";


// Generate 200 users
AppDataSource.initialize().then(async () => {

  const userRepo = AppDataSource.getRepository(User);

  for (let count = 0; count < 200; count++) {
    const username = `${count}demo_user`;
    const email = `${username}@example.com`;
    const password = `password${count}`;

  const existing = await userRepo.findOneBy({ username });

    if (!existing) {
      const user = new User()
      user.email = email;
      user.username = username;
      user.password = password;
      await userRepo.save(user);

      console.table({
        username,
        email,
        password
      });

    }
  }

  AppDataSource.destroy();
 });