# Free Cloud Wishes Wall Setup (Supabase)

Your wedding invitation website is already fully wired to sync guest wishes and likes to a free Supabase cloud database!

Whenever you want to activate the global cloud sync across all phones, follow these 3 simple steps:

---

### Step 1: Create a Free Supabase Project (Takes 1 minute)
1. Go to [https://supabase.com](https://supabase.com) and sign in for free (with GitHub, Google, or email).
2. Click **New Project**.
3. Name it: `harsha-harshitha-wedding` (select region `ap-south-1` / Mumbai or closest).

---

### Step 2: Create the `wishes` Table (1 Click SQL)
In your Supabase project dashboard:
1. Click **SQL Editor** on the left menu.
2. Click **New Query**, paste this code, and click **Run**:

```sql
create table wishes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  relation text not null,
  tag text not null,
  message text not null,
  likes int default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable public read, write, and like updates
alter table wishes enable row level security;
create policy "Allow public read" on wishes for select using (true);
create policy "Allow public insert" on wishes for insert with check (true);
create policy "Allow public update likes" on wishes for update using (true);
```

---

### Step 3: Add Keys to Vercel (or `.env.local`)
1. In Supabase, go to **Project Settings** &rarr; **API**.
2. Copy your **Project URL** and **anon public Key**.
3. Add them to your **Vercel Project Settings &rarr; Environment Variables**:
   * `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`

That's it! Every blessing written on any phone will instantly save to the cloud and be visible to everyone worldwide!
