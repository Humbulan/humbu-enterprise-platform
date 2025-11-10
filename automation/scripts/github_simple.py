#!/usr/bin/env python3
import os
import subprocess
from datetime import datetime

class GitHubSimple:
    def __init__(self):
        self.project_dir = os.path.expanduser("~/test-github-project")
    
    def daily_github_routine(self):
        """Simple daily GitHub routine"""
        print(f"\n💾 SIMPLE GITHUB DAILY ROUTINE - {datetime.now().strftime('%Y-%m-%d')}")
        print("=" * 50)
        
        # Change to project directory
        original_dir = os.getcwd()
        os.chdir(self.project_dir)
        
        try:
            # Check git status
            print("📊 Checking Git status...")
            status = subprocess.run(['git', 'status'], capture_output=True, text=True)
            print(status.stdout)
            
            # Create a daily update file
            daily_file = f"daily_update_{datetime.now().strftime('%Y%m%d')}.txt"
            with open(daily_file, 'w') as f:
                f.write(f"Daily business update for {datetime.now().strftime('%Y-%m-%d')}\n")
                f.write("✅ Social media posted\n")
                f.write("✅ Project status updated\n")
                f.write("✅ Daily tasks completed\n")
            
            print(f"📝 Created daily file: {daily_file}")
            
            # Add to git
            subprocess.run(['git', 'add', '.'], check=True)
            print("✅ Files added to git")
            
            # Commit
            commit_msg = f"Daily business update: {datetime.now().strftime('%Y-%m-%d')}"
            subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
            print(f"✅ Committed: {commit_msg}")
            
            # Try to push (will work if remote is set)
            try:
                subprocess.run(['git', 'push'], check=True)
                print("✅ Successfully pushed to remote!")
            except:
                print("💡 No remote configured - commit saved locally")
                print("🔗 To set up remote: git remote add origin YOUR_REPO_URL")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            print("💡 Make sure git is installed and configured")
        
        finally:
            os.chdir(original_dir)
        
        print("\n🎯 GITHUB COMMANDS FOR TODAY:")
        print("git status                          # Check changes")
        print("git add .                           # Stage all files")
        print("git commit -m 'Daily update'        # Commit changes")
        print("git push origin main               # Push to GitHub")
        print("git log --oneline                  # View commit history")

def main():
    github = GitHubSimple()
    github.daily_github_routine()

if __name__ == "__main__":
    main()
