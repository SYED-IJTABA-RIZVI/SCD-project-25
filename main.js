const readline = require('readline');
const db = require('./db');
require('./events/logger');
const connectDB = require('./db/mongo');
connectDB(); // Connect when app starts

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Record
6. Sort Records
7. Export Records
8. View Statistics
9. Exit
=====================
  `);

  rl.question('Choose option: ', async ans => {
    switch (ans.trim()) {

      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', async value => {
            await db.addRecord({ name, value });         // ← await used
            console.log('✅ Record added successfully!');
            menu();
          });
        });
        break;

      case '2': {
        const records = await db.listRecords();          // ← FIXED
        if (!records || records.length === 0) console.log('No records found.');
        else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
        menu();
        break;
      }

      case '3':
        rl.question('Enter record ID to update: ', id => {
          rl.question('New name: ', name => {
            rl.question('New value: ', async value => {
              const updated = await db.updateRecord(Number(id), name, value);    // ← async now
              console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
              menu();
            });
          });
        });
        break;

      case '4':
        rl.question('Enter record ID to delete: ', async id => {
          const deleted = await db.deleteRecord(Number(id));   // ← async now
          console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
          menu();
        });
        break;

      case '5':
        rl.question('Search keyword: ', async key => {
          const result = await db.searchRecords(key);
          if (result.length === 0) console.log('❌ No matches.');
          else result.forEach(r => console.log(`🔎 ${r.id} | ${r.name} | ${r.value}`));
          menu();
        });
        break;

      case '6':
        console.log(`
Sort by:
1. Name ASC
2. Name DESC
3. Value ASC
4. Value DESC
5. ID ASC
6. ID DESC
        `);
        rl.question('Choose option: ', async opt => {
          let field='name',order='asc';
          if(opt=='1') field='name',order='asc';
          if(opt=='2') field='name',order='desc';
          if(opt=='3') field='value',order='asc';
          if(opt=='4') field='value',order='desc';
          if(opt=='5') field='id',order='asc';
          if(opt=='6') field='id',order='desc';

          const sorted = await db.sortRecords(field,order);
          sorted.forEach(r => console.log(`📁 ${r.id} | ${r.name} | ${r.value}`));
          menu();
        });
        break;

      case '7': {
        const file = await db.exportVault();
        console.log(`📄 Export complete → ${file}`);
        menu();
        break;
      }

      case '8': {
        const stats = await db.vaultStats();
        console.log(stats);
        menu();
        break;
      }

      case '9':
        console.log('👋 Exiting...');
        rl.close();
        break;

      default:
        console.log('Invalid option');
        menu();
    }
  });
}

menu();

