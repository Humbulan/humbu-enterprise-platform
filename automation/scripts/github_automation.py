#!/usr/bin/env python3
import os
import subprocess
from datetime import datetime

class GitHubAutomation:
    def __init__(self):
        self.projects_dir = "~/github-projects"
    
    def daily_github_routine(self):
        """Daily GitHub sync routine"""
        print(f"\n💾 DAILY GITHUB SYNC - {datetime.now().strftime('%Y-%m-%d')}")
        print("=" * 50)
        
        # Check if in git repository
        try:
            # Get current status
            status = subprocess.run(['git', 'status'], capture_output=True, text=True)
            
            if 'not a git repository' in status.stderr:
                print("📁 Not in a Git repository")
                print("💡 Initialize with: git init")
                return
            
            # Get changes
            changes = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
            
            if changes.stdout.strip():
                print("📦 Changes detected:")
                print(changes.stdout)
                
                # Add all changes
                subprocess.run(['git', 'add', '.'])
                print("✅ Changes staged")
                
                # Commit with daily message
                commit_message = f"Daily update: {datetime.now().strftime('%Y-%m-%d')}"
                subprocess.run(['git', 'commit', '-m', commit_message])
                print(f"✅ Committed: {commit_message}")
                
                # Push to remote
                push_result = subprocess.run(['git', 'push'], capture_output=True, text=True)
                if push_result.returncode == 0:
                    print("✅ Successfully pushed to GitHub")
                else:
                    print("❌ Push failed - check remote configuration")
            else:
                print("✅ No changes to commit")
                print("💡 Working directory clean")
        
        except Exception as e:
            print(f"❌ GitHub error: {e}")
        
        print("\n🎯 GITHUB BEST PRACTICES:")
        print("• Commit daily with descriptive messages")
        print("• Use feature branches for new work")
        print("• Create pull requests for code review")
        print("• Keep main branch stable")
        print("• Write good README files")

def main():
    github = GitHubAutomation()
    github.daily_github_routine()

if __name__ == "__main__":
    main()
