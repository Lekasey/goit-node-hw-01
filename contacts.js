const fs = require('fs').promises;
const path = require('path');
const shortid = require('shortid');

const contactsPath = path.resolve('./db/contacts.json');

async function contacts() {
  const data = await fs
    .readFile(contactsPath, 'utf8')
    .then(data => JSON.parse(data))
    .catch(err => console.error(err.message));
  return data;
}

async function listContacts() {
  const contactList = await contacts();
  console.table(contactList);
}

async function getContactById(contactId) {
  const contactList = await contacts();
  const idx = contactList
    .map(contact => JSON.stringify(contact.id))
    .indexOf(contactId);
  if (idx === -1) {
    return console.log('No contact with such Id');
  }
  console.log(
    `Id: ${contactList[idx].id}, Name: ${contactList[idx].name}, Email: ${contactList[idx].email}, Phone: ${contactList[idx].phone}`,
  );
}

async function removeContact(contactId) {
  let newContacts = [];
  try {
    const oldContacts = await contacts();
    oldContacts.filter(contact => {
      if (JSON.stringify(contact.id) !== contactId) {
        newContacts = [...newContacts, contact];
      }
    });
    const newContent = JSON.stringify(newContacts);
    await fs.writeFile(contactsPath, newContent, 'utf8');
    listContacts();
  } catch (err) {
    console.error(err);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = {
      id: shortid(),
      name: name,
      email: email,
      phone: phone,
    };
    const oldContacts = await contacts();
    const newContacts = JSON.stringify([...oldContacts, newContact]);

    await fs.writeFile(contactsPath, newContacts, 'utf8');
    return listContacts();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
