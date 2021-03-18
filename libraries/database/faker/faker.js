var faker = require('faker');

var faker = require('faker');

var book = {
    title: faker.lorem.words(),
    author: faker.name.findName(),
    author_image: faker.image.avatar(),
    release_date: faker.date.recent(),
    image: faker.image.abstract(),
    price: faker.commerce.price(),
    short_description: faker.lorem.sentence(),
    long_description: faker.lorem.paragraph()
}

console.log(book);