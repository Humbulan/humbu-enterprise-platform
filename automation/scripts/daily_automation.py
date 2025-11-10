#!/usr/bin/env python3
import schedule
import time
import subprocess
import os
from datetime import datetime

class DailyAutomation:
    def __init__(self):
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
    
    def morning_routine(self):
        """Run every morning at 8:00 AM"""
        print(f"\n🌅 MORNING AUTOMATION STARTED - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        print("=" * 60)
        
        # Change to script directory
        os.chdir(self.script_dir)
        
        # Run social media posting
        print("\n1. 📱 POSTING TO SOCIAL MEDIA...")
        subprocess.run(['python', 'social_poster.py', '1'])
        
        # Run Jira standup
        print("\n2. 📊 GENERATING JIRA STANDUP REPORT...")
        subprocess.run(['python', 'jira_manager.py'])
        
        # Run GitHub sync
        print("\n3. 💾 SYNCING GITHUB REPOSITORIES...")
        subprocess.run(['python', 'github_automation.py'])
        
        print(f"\n✅ MORNING AUTOMATION COMPLETED - {datetime.now().strftime('%H:%M')}")
        print("🎯 Your business is now set up for a successful day!")
    
    def schedule_daily_tasks(self):
        """Schedule daily automation tasks"""
        # Schedule morning routine at 8:00 AM daily
        schedule.every().day.at("08:00").do(self.morning_routine)
        
        # Schedule social media posting at 9:00 AM daily
        schedule.every().day.at("09:00").do(lambda: subprocess.run(['python', 'social_poster.py', '1']))
        
        print("⏰ DAILY AUTOMATION SCHEDULER STARTED")
        print("📅 Scheduled Tasks:")
        print("   • 8:00 AM - Full morning routine")
        print("   • 9:00 AM - Social media posting")
        print("\n🛑 Press Ctrl+C to stop the scheduler")
        
        # Keep running
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

def main():
    automation = DailyAutomation()
    
    print("🚀 DAILY BUSINESS AUTOMATION SYSTEM")
    print("=" * 50)
    print("1. Run morning routine now")
    print("2. Start daily scheduler")
    print("3. Test social media posting")
    print("4. Test Jira standup")
    print("5. Test GitHub sync")
    
    choice = input("\nChoose option (1-5): ")
    
    if choice == "1":
        automation.morning_routine()
    elif choice == "2":
        automation.schedule_daily_tasks()
    elif choice == "3":
        subprocess.run(['python', 'social_poster.py', '1'])
    elif choice == "4":
        subprocess.run(['python', 'jira_manager.py'])
    elif choice == "5":
        subprocess.run(['python', 'github_automation.py'])
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main()
