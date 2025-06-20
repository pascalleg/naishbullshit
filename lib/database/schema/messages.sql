-- Create conversations table
create table conversations (
  id uuid default uuid_generate_v4() primary key,
  participants uuid[] not null,
  last_message_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{"type": "direct"}'::jsonb,
  constraint conversations_participants_length check (array_length(participants, 1) >= 2)
);

-- Create messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read_at timestamp with time zone,
  attachments jsonb,
  metadata jsonb default '{"edited": false, "deleted": false}'::jsonb
);

-- Add indexes for better query performance
create index conversations_participants_idx on conversations using gin(participants);
create index conversations_last_message_id_idx on conversations(last_message_id);
create index conversations_updated_at_idx on conversations(updated_at);

create index messages_conversation_id_idx on messages(conversation_id);
create index messages_sender_id_idx on messages(sender_id);
create index messages_receiver_id_idx on messages(receiver_id);
create index messages_created_at_idx on messages(created_at);

-- Add trigger to update conversation's last_message_id
create or replace function update_conversation_last_message()
returns trigger as $$
begin
  update conversations
  set last_message_id = new.id,
      updated_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql;

create trigger update_conversation_last_message_trigger
  after insert on messages
  for each row
  execute function update_conversation_last_message();

-- Add RLS policies
alter table conversations enable row level security;
alter table messages enable row level security;

-- Conversations policies
create policy "Users can view their own conversations"
  on conversations for select
  using (
    auth.uid() = any(participants)
  );

create policy "Users can create conversations they are part of"
  on conversations for insert
  with check (
    auth.uid() = any(participants)
  );

create policy "Users can update their own conversations"
  on conversations for update
  using (
    auth.uid() = any(participants)
  );

-- Messages policies
create policy "Users can view messages in their conversations"
  on messages for select
  using (
    auth.uid() in (
      select unnest(participants)
      from conversations
      where id = conversation_id
    )
  );

create policy "Users can send messages in their conversations"
  on messages for insert
  with check (
    auth.uid() = sender_id and
    auth.uid() in (
      select unnest(participants)
      from conversations
      where id = conversation_id
    )
  );

create policy "Users can update their own messages"
  on messages for update
  using (
    auth.uid() = sender_id
  );

create policy "Users can delete their own messages"
  on messages for delete
  using (
    auth.uid() = sender_id
  ); 