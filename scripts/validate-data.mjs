import fs from'node:fs';
const deadlinePath='public/data/deadlines.json',transactionPath='public/data/transactions.json';
const deadlines=JSON.parse(fs.readFileSync(deadlinePath,'utf8'));
if(!deadlines.organization_name||!Array.isArray(deadlines.events))throw new Error('Invalid deadline snapshot.');
for(const event of deadlines.events)if(!event.id||!event.type||!/^\d{4}-\d{2}-\d{2}$/.test(event.due_date))throw new Error('Invalid event: '+JSON.stringify(event));
if(fs.existsSync(transactionPath)){
  const transactions=JSON.parse(fs.readFileSync(transactionPath,'utf8'));
  if(!Array.isArray(transactions.applications))throw new Error('Invalid transaction snapshot.');
  for(const application of transactions.applications)if(!application.application_number||!Array.isArray(application.transactions))throw new Error('Invalid transaction application: '+JSON.stringify(application));
}
console.log('Validated '+deadlines.events.length+' events'+(fs.existsSync(transactionPath)?' and the transaction snapshot.':'.'));
