import { emailGenerator } from "../generators/email.generator.js";

const USERNAMES = [
  "johnjoe",
  "john_jon2",
  "_paige.renee",
  "123john_",
  "joe-john",
];

function generateEmails(usernames: string[]) {
  return usernames.map((username) => emailGenerator(username));
}

console.log(generateEmails(USERNAMES));
