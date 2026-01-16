# How to Use Auto-Commit Feature

## Setup

1. **Open PowerShell in project directory**
   ```powershell
   cd "c:\Users\chand\Downloads\solve null"
   ```

2. **Run the auto-commit script**
   ```powershell
   .\auto-commit.ps1
   ```

3. **Script will:**
   - Watch for file changes every 30 seconds
   - Automatically commit changes with timestamp
   - Push to GitHub
   - Vercel will auto-deploy (1-2 minutes after push)

## Stop Auto-Commit

Press `Ctrl + C` in the PowerShell window

## What Happens

1. You edit any file in the project
2. Within 30 seconds, changes are detected
3. Auto-commit with timestamp message
4. Auto-push to GitHub
5. Vercel automatically deploys the update
6. Live site updates at: https://solve-null.vercel.app

## Important Notes

- ⚠️ Keep the PowerShell window open while working
- 📁 `.env.local` is NOT committed (password stays secret)
- 🔄 Vercel deployment takes 1-2 minutes after push
- ⏱️ Changes are checked every 30 seconds

## Connect Vercel to GitHub (One-Time Setup)

1. Go to: https://vercel.com/chandra-shekars-projects/solve-null/settings/git
2. Click "Connect Git Repository"
3. Select: https://github.com/ChandraMoon88/solve-null
4. Save

After this, every push to GitHub = automatic Vercel deployment!

## Troubleshooting

**Script won't run:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Git authentication errors:**
```powershell
git config --global credential.helper manager-core
```

**Check if auto-deploy is working:**
- Visit: https://vercel.com/chandra-shekars-projects/solve-null/deployments
- You should see deployments triggered by GitHub pushes
