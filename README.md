# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c4503b7b-369b-49d0-887b-c7c71e31ca4e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c4503b7b-369b-49d0-887b-c7c71e31ca4e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Database, Auth, Storage)

## Database Schema

### `profiles`
| Column      | Type        | Constraints                          |
|-------------|-------------|--------------------------------------|
| id          | UUID        | PRIMARY KEY, REFERENCES auth.users   |
| name        | TEXT        |                                      |
| phone       | TEXT        |                                      |
| created_at  | TIMESTAMPTZ | DEFAULT now(), NOT NULL              |
| updated_at  | TIMESTAMPTZ | DEFAULT now(), NOT NULL              |

### `contacts`
| Column      | Type        | Constraints                                    |
|-------------|-------------|------------------------------------------------|
| id          | UUID        | PRIMARY KEY, DEFAULT gen_random_uuid()         |
| user_id     | UUID        | REFERENCES profiles(id), NOT NULL             |
| name        | TEXT        | NOT NULL                                        |
| phone       | TEXT        |                                                 |
| balance     | NUMERIC     | DEFAULT 0, NOT NULL                             |
| created_at  | TIMESTAMPTZ | DEFAULT now(), NOT NULL                         |
| updated_at  | TIMESTAMPTZ | DEFAULT now(), NOT NULL                         |

### `transactions`
| Column      | Type        | Constraints                                    |
|-------------|-------------|------------------------------------------------|
| id          | UUID        | PRIMARY KEY, DEFAULT gen_random_uuid()         |
| contact_id  | UUID        | REFERENCES contacts(id), NOT NULL              |
| user_id     | UUID        | REFERENCES profiles(id), NOT NULL             |
| amount      | NUMERIC     | NOT NULL                                        |
| type        | TEXT        | CHECK (type IN ('GIVEN', 'TAKEN')), NOT NULL   |
| description | TEXT        |                                                 |
| date        | TIMESTAMPTZ | DEFAULT now(), NOT NULL                         |
| created_at  | TIMESTAMPTZ | DEFAULT now(), NOT NULL                         |

### Security
- **Row Level Security (RLS)** is enabled on all tables
- Users can only access their own profiles, contacts, and transactions
- Triggers auto-update `updated_at` on profiles and contacts
- Auto-creates a profile row when a new user signs up

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c4503b7b-369b-49d0-887b-c7c71e31ca4e) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
