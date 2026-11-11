const STORAGE_KEY='patent-portfolio-seen-transactions-v1';

export const transactionId=transaction=>[transaction.event_date,transaction.event_code,transaction.description].join('|');

export function isRecentTransaction(transaction){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(transaction?.event_date||''))return false;
  const age=(Date.now()-new Date(`${transaction.event_date}T12:00:00Z`).getTime())/864e5;
  return age>=0&&age<30;
}

export function loadSeenTransactions(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}}
}

export function saveSeenTransactions(value){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}catch{}
}
