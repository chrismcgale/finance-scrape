// const person = {
//     name: 'Chris',
//     age: 21,
//     location: {
//         city: 'Toronto',
//         temp: '23'
//     }
// }

// //Default value
// const { name = 'Anon' , age } = person;
// // const name = person.name;
// // const age = person.age;

// console.log(`${name} is ${age}`);

// //Reassignment
// //Can no longer use temp
// const {city, temp: temperature} = person.location;

// if (city && temperature) {
//     console.log(`It's ${temperature} in ${city}`);
// }

// Object Destructoring

// const book = {
//     title: 'Ego is the enemy',
//     author: 'Ryan Holiday',
//     publisher: {
//         name: 'Penguin'
//     }
// };

// const {name: publisherName = 'Self Published'} = book.publisher;

// console.log(publisherName)

// Array destructuring

const address = ['1299 South Juniper Street', 'Phili', 'Penny', '19147'];

const [, city, state = 'New York'] = address;

console.log(`You are in ${city} ${state}`)

const item = ['Coffee (hot)', '$2.00', '$2.50', '$2.75'];

const [itemName, , medium] = item;

console.log(`A medium ${itemName} costs ${medium}`)