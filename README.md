# ETHER Production Management System

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration
DATABASE_URL=your_database_url

# Storage Configuration
NEXT_PUBLIC_STORAGE_URL=your_storage_url

# API Configuration
NEXT_PUBLIC_API_URL=your_api_url

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Feature Flags
ENABLE_PRODUCTION_FEATURES=true
ENABLE_EQUIPMENT_MANAGEMENT=true
ENABLE_AVAILABILITY_MANAGEMENT=true
ENABLE_PORTFOLIO_MANAGEMENT=true
ENABLE_CALENDAR_SYNC=true
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the database migrations:
   ```bash
   npm run migrate
   ```

### 3. Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Features

### Equipment Management
- Add, edit, and delete equipment
- Track equipment condition and maintenance
- Categorize equipment
- Search and filter equipment

### Availability Management
- Set availability for specific dates and times
- Block out unavailable periods
- Sync with external calendars

### Portfolio Management
- Showcase work with images and descriptions
- Categorize portfolio items
- Feature specific items
- Add tags for better organization

### Calendar Sync
- Sync with external calendars
- Manage availability across platforms
- Track bookings and events

## Security

The system implements Row Level Security (RLS) policies to ensure:
- Users can only access their own data
- Data is properly validated before storage
- Sensitive operations are protected

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
