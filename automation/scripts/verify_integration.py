#!/usr/bin/env python3
"""
Verifies the AI Data Master integration
"""

import json
import os

def verify_integration():
    print("🔍 VERIFYING INTEGRATION")
    print("=" * 40)
    
    # Check enterprise data
    if os.path.exists("master_data.json"):
        with open("master_data.json", 'r') as f:
            data = json.load(f)
        print("✅ Enterprise data: FOUND")
        print(f"   📊 Productivity: {data.get('productivity_score', 'N/A')}")
        print(f"   🎯 Focus Score: {data.get('focus_score', 'N/A')}")
    else:
        print("❌ Enterprise data: MISSING")
        
    # Check integrated dashboard
    dashboard_path = os.path.expanduser("~/enterprise-ai-dashboard.html")
    if os.path.exists(dashboard_path):
        print("✅ Integrated dashboard: FOUND")
        file_size = os.path.getsize(dashboard_path)
        print(f"   📁 File size: {file_size} bytes")
    else:
        print("❌ Integrated dashboard: MISSING")
        
    # Check backup
    backup_path = os.path.expanduser("~/standalone-ai-backup.html")
    if os.path.exists(backup_path):
        print("✅ Original backup: FOUND")
    else:
        print("⚠️  Original backup: NOT FOUND")
        
    print("\n🎯 NEXT STEPS:")
    print("1. Open: ~/enterprise-ai-dashboard.html")
    print("2. Run automation: python enterprise_ai_master.py")
    print("3. Dashboard auto-updates daily at 8 AM")

if __name__ == "__main__":
    verify_integration()
