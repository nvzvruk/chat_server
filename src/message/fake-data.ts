import { faker } from '@faker-js/faker';

const createMessage = () => {
  const text = faker.lorem.words({ min: 4, max: 30 });
  const date = faker.date.recent({ days: 30 });
  const sender = {
    id: faker.database.mongodbObjectId(),
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
  };

  return {
    id: faker.database.mongodbObjectId(),
    text,
    date,
    sender,
  };
};

export const fakeMessages = faker.helpers
  .multiple(createMessage, {
    count: 200,
  })
  .sort((a, b) => a.date.getTime() - b.date.getTime());
