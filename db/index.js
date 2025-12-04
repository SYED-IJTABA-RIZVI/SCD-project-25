const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Record = require('../models/Record');
const vaultEvents = require('../events');

async function addRecord({ name, value }) {
  const last = await Record.findOne().sort({ id: -1 });
  const newId = last ? last.id + 1 : 1;
  const doc = await Record.create({ id: newId, name, value });
  vaultEvents.emit('recordAdded', doc);
  return doc;
}

async function listRecords() {
  return await Record.find().sort({ id: 1 });
}

async function updateRecord(id, newName, newValue) {
  const updated = await Record.findOneAndUpdate(
    { id },
    { name: newName, value: newValue },
    { new: true }
  );
  vaultEvents.emit('recordUpdated', updated);
  return updated;
}

async function deleteRecord(id) {
  const deleted = await Record.findOneAndDelete({ id });
  vaultEvents.emit('recordDeleted', deleted);
  return deleted;
}

async function searchRecords(keyword) {
  const key = new RegExp(keyword, "i");
  return await Record.find({
    $or: [
      { name: key },
      { value: key },
      { id: Number(keyword) || -1 }
    ]
  });
}

async function sortRecords(field = 'name', order = 'asc') {
  return await Record.find().sort({ [field]: order === 'desc' ? -1 : 1 });
}

async function exportVault(fileName = 'export.txt') {
  const data = await Record.find().sort({ id: 1 });
  const filePath = path.join(__dirname, '../data', fileName);

  let content = `Vault Export - ${new Date().toLocaleString()}\n\n`;
  data.forEach((r, i) => {
    content += `${i + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value}\n`;
  });

  fs.writeFileSync(filePath, content);
  return filePath;
}

async function vaultStats() {
  const data = await Record.find();
  if (data.length === 0) return { message: "Vault is empty" };

  return {
    totalRecords: data.length,
    longestNameRecord: data.reduce((a,b)=>a.name.length>b.name.length?a:b),
    shortestNameRecord: data.reduce((a,b)=>a.name.length<b.name.length?a:b),
    sample: data.slice(0,3)
  };
}

module.exports = {
  addRecord,
  listRecords,
  updateRecord,
  deleteRecord,
  searchRecords,
  sortRecords,
  exportVault,
  vaultStats
};

