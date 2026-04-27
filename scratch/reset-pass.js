const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function run() {
  const uri = 'mongodb+srv://saioms_user:Ayushraj%4012@sipwar.demecky.mongodb.net/sipwar?appName=sipwar';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('sipwar');
    
    const email = 'anuragrajput874@gmail.com';
    const password = 'Sipwar@2026';
    
    console.log(`Setting password to: "${password}" for ${email}`);
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.collection('users').updateOne(
      { email: email },
      { $set: { password: hashedPassword, role: 'admin' } }
    );
    
    console.log('Update result:', result);
    
    const user = await db.collection('users').findOne({ email: email });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Verification match:', isMatch);
    
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
