#!/usr/bin/env python3
"""
Simple dashboard viewer for terminal
"""

import json
import os
from datetime import datetime

def display_dashboard():
    print("\n" + "="*60)
    print("🏢 ENTERPRISE AI DASHBOARD - TERMINAL VIEW")
    print("="*60)
    
    if not os.path.exists("master_data.json"):
        print("❌ No enterprise data found")
        print("💡 Run: python enterprise_ai_master.py")
        return
        
    with open("master_data.json", 'r') as f:
        data = json.load(f)
    
    # Key metrics
    print(f"📊 PRODUCTIVITY: {data.get('productivity_score', 'N/A')}")
    print(f"🎯 FOCUS SCORE:  {data.get('focus_score', 'N/A')}")
    
    enterprise_metrics = data.get('enterprise_metrics', {})
    print(f"📈 REVENUE:      {enterprise_metrics.get('revenue_growth', 'N/A')}%")
    print(f"👥 CUSTOMERS:    {enterprise_metrics.get('customer_acquisition', 'N/A')}%")
    
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
    print("🌐 Full Dashboard: ~/enterprise-ai-dashboard.html")

if __name__ == "__main__":
    display_dashboard()
