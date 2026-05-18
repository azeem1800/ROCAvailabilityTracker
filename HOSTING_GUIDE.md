# Hosting Guide for ROC Availability Tracker

This guide provides instructions for hosting your ROC Availability Tracker application online so you can share it with others. Since this is a static web application (HTML, CSS, and JavaScript), there are several free and easy options for hosting.

## Option 1: GitHub Pages (Free)

GitHub Pages is a free hosting service provided by GitHub for static websites.

### Steps:

1. **Create a GitHub Account** (if you don't have one)
   - Go to [github.com](https://github.com/) and sign up

2. **Create a New Repository**
   - Click the "+" icon in the upper right corner and select "New repository"
   - Name it `roc-availability-tracker` (or any name you prefer)
   - Make it public
   - Click "Create repository"

3. **Upload Your Files**
   - Click "uploading an existing file" on the repository page
   - Drag and drop all files and folders from your `l1-availability-tracker` folder
   - Or upload the `roc-availability-tracker.zip` file and extract it in GitHub
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to the repository's "Settings" tab
   - Scroll down to the "Pages" section in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder, then click "Save"
   - Wait a moment and refresh the page - you'll see a message saying "Your site is published at https://yourusername.github.io/roc-availability-tracker/"

5. **Share Your Site**
   - Copy the URL provided (https://yourusername.github.io/roc-availability-tracker/)
   - Share this URL with anyone who needs access to the application

> **Note:** The application has been updated to ensure proper path handling for GitHub Pages. All CSS, JavaScript, and link paths use the `./` prefix to ensure resources are loaded correctly from a subdirectory.

## Option 2: Netlify (Free Plan)

Netlify offers a generous free tier with an easy drag-and-drop deployment option.

### Steps:

1. **Create a Netlify Account**
   - Go to [netlify.com](https://www.netlify.com/) and sign up (you can use GitHub, GitLab, Bitbucket, or email)

2. **Deploy Your Site**
   - After logging in, go to the "Sites" tab
   - Simply drag and drop your `roc-availability-tracker.zip` file onto the designated area
   - Netlify will automatically upload, extract, and deploy your site

3. **Customize Your Site Name (Optional)**
   - By default, Netlify assigns a random name like `random-word-123456.netlify.app`
   - To change this, go to "Site settings" > "Change site name"
   - Choose something memorable like `roc-availability-tracker.netlify.app`

4. **Share Your Site**
   - Copy your Netlify site URL (e.g., `https://roc-availability-tracker.netlify.app`)
   - Share this URL with anyone who needs access to the application

## Option 3: Vercel (Free Plan)

Vercel is another excellent platform for static site hosting with a generous free tier.

### Steps:

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com/) and sign up (you can use GitHub, GitLab, or Bitbucket)

2. **Install Vercel CLI (Optional)**
   - If you prefer using the command line:
   - Open your terminal/command prompt
   - Run `npm install -g vercel`
   - Navigate to your project directory: `cd path/to/l1-availability-tracker`
   - Run `vercel`
   - Follow the prompts to deploy

3. **Deploy Using the Web Interface**
   - After logging in, click "Import Project"
   - Click "Upload" and select your `roc-availability-tracker.zip` file
   - Follow the prompts to complete deployment

4. **Share Your Site**
   - Vercel will provide a URL like `roc-availability-tracker.vercel.app`
   - Share this URL with anyone who needs access to the application

## Option 4: Surge.sh (Free)

Surge is a simple command-line tool for deploying static websites.

### Steps:

1. **Install Surge**
   - Open your terminal/command prompt
   - Run `npm install --global surge`

2. **Deploy Your Site**
   - Navigate to your project directory: `cd path/to/l1-availability-tracker`
   - Run `surge`
   - Follow the prompts to create an account and deploy your site
   - You can choose a custom subdomain like `roc-availability-tracker.surge.sh`

3. **Share Your Site**
   - Copy your Surge URL (e.g., `https://roc-availability-tracker.surge.sh`)
   - Share this URL with anyone who needs access to the application

## Important Notes:

- **Data Privacy**: The application stores data in the browser's localStorage, which is specific to each user and device. This means:
  - Each user will need to upload their own roster data
  - Data won't be shared between users or devices
  - No data is stored on the server

- **Updating the Site**: If you make changes to your application:
  - For GitHub Pages: Upload the updated files to your repository
  - For Netlify/Vercel: Simply drag and drop your updated folder or ZIP file again
  - For Surge: Run the `surge` command again from your updated directory

- **Custom Domains**: All of these services allow you to use your own domain name if you have one (may require paid plans or additional setup)

Choose the option that seems easiest for you - all will work equally well for this application!