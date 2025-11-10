#!/usr/bin/env python3
"""
AI Data Master Integration Bridge
This script helps connect your Enterprise Automation with AI Data Master
"""

import json
import os
from datetime import datetime

def display_integration_status():
    """Shows the current integration status"""
    
    print("🔗 AI DATA MASTER INTEGRATION STATUS")
    print("=" * 50)
    
    # Check if master_data.json exists
    if os.path.exists("master_data.json"):
        with open("master_data.json", 'r') as f:
            data = json.load(f)
        
        print("✅ MASTER DATA.JSON FOUND")
        print(f"📊 Productivity Score: {data.get('productivity_score', 'N/A')}")
        print(f"🎯 Focus Score: {data.get('focus_score', 'N/A')}")
        print(f"📈 Revenue Growth: {data.get('enterprise_metrics', {}).get('revenue_growth', 'N/A')}%")
        print(f"🕒 Last Update: {data.get('last_update', 'N/A')}")
        
        print("\n🎯 ACTIVE GOALS:")
        for goal in data.get('active_goals', []):
            print(f"   • {goal.get('title')}: {goal.get('progress')}% complete")
            
    else:
        print("❌ master_data.json not found")
        print("💡 Run: python enterprise_ai_master.py")

def create_ai_master_config():
    """Creates configuration for AI Data Master integration"""
    
    config = {
        "enterprise_integration": {
            "enabled": True,
            "data_source": "./master_data.json",
            "update_frequency": "daily",
            "last_sync": datetime.now().isoformat()
        },
        "data_mapping": {
            "productivity_score": "productivity_score",
            "focus_score": "focus_score", 
            "screen_time_metric": "screen_time_metric",
            "active_goals": "active_goals",
            "enterprise_metrics": "enterprise_metrics"
        },
        "automation_schedule": {
            "morning_routine": "0 8 * * *",
            "data_refresh": "*/30 * * * *",
            "github_sync": "0 9 * * *"
        }
    }
    
    with open("ai_master_config.json", 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✅ AI Master configuration created: ai_master_config.json")

if __name__ == "__main__":
    display_integration_status()
    create_ai_master_config()
    print("\n🎯 NEXT: Configure your AI Data Master app to read from master_data.json")
