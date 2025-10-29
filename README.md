# I. Project Overview

## INTRODUCTION
  this is a simple job portal site that implement a hand gesture recognition to automatically take picture from camera, need a lot more improvement but here is a demo app

  [DEMO](https://portal-job-rakamin.netlify.app/)

  ```auth admin
    email: admin@gmail.com
    pass: password
  ```
  as for the user role account, you can just signup a new one

## FEATURE
  ### Authentication (Login and Sign up):
    - you can sign up a new account, and of course the role of this newly created account will be "user"
    - auto redirected for each role (still need improvement a lot, but functional)

  ### Hand Gesture
    - implement hand gesture landmarking from mediapipe library from google MLkit

# II. Tech stack used
- Next js as the main framework
- shadcn for the component
- tailwind css v4+ as the css framework
- supabase for the database
- mediapipe/tasks vision for model and hand gesture handler

# III. HOW TO RUN LOCALLY

after you clone this repository, there are several steps that you should do before try to run this app

1.  first, open supabase to open up a new project, and you can just copy/paste these queries

```
  -- Enable required extension for gen_random_uuid()
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  -- ========================================
  -- 1️⃣ job_types + sequence
  -- ========================================
  CREATE SEQUENCE IF NOT EXISTS job_types_id_seq;

  CREATE TABLE public.job_types (
    id integer NOT NULL DEFAULT nextval('job_types_id_seq'::regclass),
    name text NOT NULL UNIQUE,
    CONSTRAINT job_types_pkey PRIMARY KEY (id)
  );


  -- ========================================
  -- 2️⃣ jobs table
  -- (Depends on auth.users via FK)
  -- ========================================
  CREATE TABLE public.jobs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    job_name text NOT NULL,
    job_type text NOT NULL,
    job_description text,
    candidate_needed integer NOT NULL DEFAULT 1,
    min_salary numeric,
    max_salary numeric,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT jobs_pkey PRIMARY KEY (id),
    CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
  );


  -- ========================================
  -- 3️⃣ profiles
  -- (Depends on auth.users)
  -- ========================================
  CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    role text DEFAULT 'user'::text
      CHECK (role = ANY (ARRAY['admin'::text, 'user'::text])),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id)
      REFERENCES auth.users(id) ON DELETE CASCADE
  );


  -- ========================================
  -- 4️⃣ job_applicants
  -- (Depends on public.jobs)
  -- ========================================
  CREATE TABLE public.job_applicants (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    job_id uuid NOT NULL,
    full_name text NOT NULL,
    photo_profile text,
    gender text,
    domicile text,
    email text NOT NULL,
    phone_number text,
    linkedin_link text,
    date_of_birth date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT job_applicants_pkey PRIMARY KEY (id),
    CONSTRAINT fk_job FOREIGN KEY (job_id)
      REFERENCES public.jobs(id) ON DELETE CASCADE
  );


  -- ========================================
  -- 5️⃣ job_profile_requirements
  -- (Depends on public.jobs)
  -- ========================================
  CREATE TABLE public.job_profile_requirements (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    job_id uuid,
    field_name text NOT NULL,
    requirement_type text
      CHECK (requirement_type = ANY (
        ARRAY['mandatory'::text, 'optional'::text, 'off'::text]
      )),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT job_profile_requirements_pkey PRIMARY KEY (id),
    CONSTRAINT job_profile_requirements_job_id_fkey FOREIGN KEY (job_id)
      REFERENCES public.jobs(id) ON DELETE CASCADE
  );


  -- ========================================
  -- 6️⃣ Auto-update updated_at trigger
  -- ========================================
  CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER update_timestamp_jobs
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

  CREATE TRIGGER update_timestamp_job_applicants
  BEFORE UPDATE ON public.job_applicants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

2. add function to automatically update new user registered and handle update_at field

  ```add new user
    begin
      insert into public.profiles (id, full_name, role)
      values (new.id, new.raw_user_meta_data->>'full_name', 'user');
      return new;
    end;
  ```
  ```update updated_at
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;

  ```

3. then create .env file in project's root folder and insert these 2 fields below

  ```.env
    NEXT_PUBLIC_SUPABASE_URL=/* diambil dari supabase->project->project settings->Data API->URL */
    NEXT_PUBLIC_ANON_KEY=/* diambil dari supabase->project->project settings->API Keys->anon public */
  ```

4. then run
  ```bash
    npm install --save
    <!-- or -->
    pnpm install
    <!-- or -->
    yarn install/add
  ```

  ```bash
    pnpm/npm/yarn dev
  ```

  untuk me run aplikasi