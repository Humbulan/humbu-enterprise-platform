#!/usr/bin/env python3
"""
Real-time Enterprise Data Monitor
Shows current business metrics in a simple dashboard
"""

import json
import os
import time
from datetime import datetime

class EnterpriseMonitor:
    def __init__(self):
        self.data_file = "master_data.json"
        
    def display_dashboard(self):
        """Displays a simple text-based dashboard"""
        
        if not os.path.exists(self.data_file):
            print("❌ No enterprise data found")
            print("💡 Run: python enterprise_ai_master.py")
            return
        
        with open(self.data_file, 'r') as f:
            data = json.load(f)
        
        print("\n" + "="*60)
        print("🏢 ENTERPRISE BUSINESS DASHBOARD")
        print("="*60)
        
        # Key Metrics
        print(f"📊 PRODUCTIVITY: {data.get('productivity_score', 'N/A')}")
        print(f"🎯 FOCUS SCORE:  {data.get('focus_score', 'N/A')}")
        print(f"📈 REVENUE:      {data.get('enterprise_metrics', {}).get('revenue_growth', 'N/A')}%")
        
        print("\n🏆 ACTIVE GOALS:")
        for goal in data.get('active_goals', []):
            progress_bar = "█" * (goal.get('progress', 0) // 10) + "░" * (10 - goal.get('progress', 0) // 10)
            print(f"   {goal.get('title')}")
            print(f"   [{progress_bar}] {goal.get('progress')}% - {goal.get('target')}")
            print()
        
        print("📋 PROJECT STATUS:")
        for project, progress in data.get('project_status', {}).items():
            print(f"   • {project}: {progress}%")
        
        print(f"\n🕒 Last Updated: {data.get('last_update', 'N/A')}")
        print("="*60)

    def continuous_monitor(self, interval=30):
        """Continuously monitors enterprise data"""
        print("🚀 Starting Enterprise Monitor...")
        print("Press Ctrl+C to stop\n")
        
        try:
            while True:
                os.system('clear' if os.name == 'posix' else 'cls')
                self.display_dashboard()
                print(f"\n🔄 Refreshing in {interval} seconds...")
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n🛑 Monitor stopped")

if __name__ == "__main__":
    monitor = EnterpriseMonitor()
    monitor.display_dashboard()
    
    # Uncomment the next line for continuous monitoring
    # monitor.continuous_monitor(30)
