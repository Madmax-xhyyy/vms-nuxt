import { MongoClient } from 'mongodb';
const client = new MongoClient('mongodb://localhost:27017');
client.connect().then(async () => {
  const db = client.db('vms_db');
  const apps = await db.collection('appointments').find({}).sort({ createdAt: -1 }).limit(20).toArray();
  apps.forEach(a => console.log({ id: a._id, fullName: a.fullName, dateTime: a.dateTime, status: a.status, type: typeof a.dateTime }));
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
