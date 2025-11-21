#!/usr/bin/env python3
import schedule
import time
import subprocess
import os
from datetime import datetime

class AutoScheduler:
    def __init__(self):
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
    
    def scheduled_morning_routine(self):
        """This runs automatically every morning at 7:00 AM"""
        print(f"\n⏰ AUTOMATED MORNING ROUTINE - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        print("=" * 60)
        
        os.chdir(self.script_dir)
        subprocess.run(['python', 'local_daily_routine.py'])
    
    def start_scheduler(self):
        """Start the daily automation scheduler"""
        # Schedule for 7:00 AM every day
        schedule.every().day.at("07:00").do(self.scheduled_morning_routine)
        
        # Also schedule social media boost at 9:00 AM
        schedule.every().day.at("09:00").do(lambda: subprocess.run(['python', 'social_poster.py', '1']))
        
        print("🔄 DAILY AUTOMATION SCHEDULER STARTED!")
        print("📅 Your daily schedule:")
        print("   ⏰ 7:00 AM - Complete morning routine")
        print("   📱 9:00 AM - Social media posting")
        print("\n💡 The system will now run automatically every day!")
        print("🛑 Press Ctrl+C to stop the scheduler")
        
        # Keep running
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

def main():
    scheduler = AutoScheduler()
    
    print("🚀 BUSINESS AUTOMATION SCHEDULER")
    print("=" * 50)
    print("1. Start daily automation (runs at 7AM & 9AM daily)")
    print("2. Run morning routine now")
    print("3. Test social media posting")
    print("4. View today's progress")
    
    choice = input("\nChoose option (1-4): ")
    
    if choice == "1":
        scheduler.start_scheduler()
    elif choice == "2":
        subprocess.run(['python', 'local_daily_routine.py'])
    elif choice == "3":
        subprocess.run(['python', 'social_poster.py', '1'])
    elif choice == "4":
        subprocess.run(['python', 'jira_manager.py'])
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main()
