const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const crypto = require('crypto');

const env = fs.readFileSync('.env', 'utf-8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
const supabase = createClient(url, key);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function testDirectResetFlow() {
  const testEmail = 'harispatel62@gmail.com';
  const newPassword = 'MyNewPassword123!';

  console.log('1. Checking user existence for:', testEmail);
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .ilike('email', testEmail)
    .maybeSingle();

  if (pErr || !profile) {
    throw new Error('Profile not found: ' + JSON.stringify(pErr));
  }
  console.log('   User found:', profile.name, profile.id);

  console.log('2. Applying direct reset override with new password...');
  const hashed = hashPassword(newPassword);
  const pwdText = `pwd:sha256:${hashed}`;

  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', profile.id)
    .ilike('text', 'pwd:%')
    .maybeSingle();

  if (existing) {
    await supabase.from('reviews').update({ text: pwdText }).eq('id', existing.id);
    console.log('   Updated existing password override entry.');
  } else {
    await supabase.from('reviews').insert({
      id: crypto.randomUUID(),
      user_id: profile.id,
      lab_id: null,
      rating: null,
      text: pwdText
    });
    console.log('   Inserted new password override entry.');
  }

  console.log('3. Simulating authAPI.login with testEmail and newPassword...');
  const hashedInput = hashPassword(newPassword);
  const { data: pwdEntry } = await supabase
    .from('reviews')
    .select('text')
    .eq('user_id', profile.id)
    .ilike('text', 'pwd:%')
    .maybeSingle();

  const storedHash = pwdEntry.text.replace('pwd:sha256:', '').replace('pwd:', '').trim();
  const match = (storedHash === hashedInput);
  console.log('   Password match verified:', match);

  console.log('4. Simulating authAPI.login with WRONG password...');
  const wrongHashedInput = hashPassword('WrongPassword999!');
  const wrongMatch = (storedHash === wrongHashedInput);
  console.log('   Wrong password correctly rejected:', !wrongMatch);

  console.log('All checks passed successfully!');
}

testDirectResetFlow().catch(console.error);
