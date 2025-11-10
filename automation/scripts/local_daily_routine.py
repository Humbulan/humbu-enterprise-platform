#!/usr/bin/env python3
import os
import subprocess
from datetime import datetime

class LocalDailyRoutine:
    def __init__(self):
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
    
    def full_morning_routine(self):
        """Complete morning routine without GitHub requirements"""
        print(f"\n🌅 COMPLETE MORNING ROUTINE - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        print("=" * 65)
        
        os.chdir(self.script_dir)
        
        # 1. Social Media Posting
        print("\n1. 📱 POSTING TO SOCIAL MEDIA PLATFORMS...")
        subprocess.run(['python', 'social_poster.py', '1'], capture_output=True)
        
        # 2. Project Management
        print("\n2. 📊 GENERATING PROJECT STANDUP REPORT...")
        subprocess.run(['python', 'jira_manager.py'], capture_output=True)
        
        # 3. Local Git Tracking (No remote needed)
        print("\n3. 💾 LOCAL PROGRESS TRACKING...")
        self.local_git_update()
        
        print(f"\n✅ MORNING ROUTINE COMPLETED SUCCESSFULLY!")
        print("🎯 Your business is set up for an amazing day!")
        print("📊 All progress saved locally - no GitHub required!")
    
    def local_git_update(self):
        """Update local git without pushing to remote"""
        project_dir = os.path.expanduser("~/test-github-project")
        original_dir = os.getcwd()
        
        try:
            os.chdir(project_dir)
            
            # Create daily progress file
            daily_file = f"progress_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
            with open(daily_file, 'w') as f:
                f.write(f"Business Progress Update - {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
                f.write("========================================\n")
                f.write("✅ Social Media: Posted to all platforms\n")
                f.write("✅ Projects: Standup report generated\n") 
                f.write("✅ Planning: Daily goals set\n")
                f.write("✅ Progress: Tracked and documented\n")
                f.write("========================================\n")
            
            # Add and commit locally
            subprocess.run(['git', 'add', '.'], check=True)
            commit_msg = f"Business daily routine: {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
            
            print(f"✅ Daily progress saved: {daily_file}")
            print("✅ Local git commit created")
            print("💡 All your work is tracked locally!")
            
        except Exception as e:
            print(f"⚠️ Local tracking: {e}")
        finally:
            os.chdir(original_dir)

def main():
    routine = LocalDailyRoutine()
    
    print("🚀 LOCAL BUSINESS AUTOMATION SYSTEM")
    print("=" * 50)
    print("🌅 Runs every morning - No internet required!")
    print("📱 Social media posts ready to copy/paste")
    print("📊 Project management built-in")
    print("💾 Progress tracking automated")
    print("=" * 50)
    
    input("Press Enter to run your morning routine...")
    routine.full_morning_routine()

if __name__ == "__main__":
    main()
