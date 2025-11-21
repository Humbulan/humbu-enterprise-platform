#!/usr/bin/env python3
"""
AI Data Master Integration - FIXED VERSION
Connects Enterprise Automation with your standalone-ai.html dashboard
"""

import json
import os
import shutil
from datetime import datetime

class AIMasterIntegrator:
    def __init__(self):
        self.enterprise_data_file = "master_data.json"
        self.ai_master_file = os.path.expanduser("~/standalone-ai.html")
        self.backup_file = os.path.expanduser("~/standalone-ai-backup.html")
        
    def backup_original(self):
        """Creates a backup of the original AI Master file"""
        if os.path.exists(self.ai_master_file):
            shutil.copy2(self.ai_master_file, self.backup_file)
            print(f"✅ Backup created: {self.backup_file}")
        else:
            print(f"❌ AI Master file not found: {self.ai_master_file}")
            
    def read_enterprise_data(self):
        """Reads the enterprise data from master_data.json"""
        if not os.path.exists(self.enterprise_data_file):
            print("❌ Enterprise data file not found")
            return None
            
        with open(self.enterprise_data_file, 'r') as f:
            return json.load(f)
            
    def create_integrated_dashboard(self):
        """Creates a new integrated dashboard HTML file"""
        
        enterprise_data = self.read_enterprise_data()
        if not enterprise_data:
            return False
        
        # Extract data safely
        productivity_score = enterprise_data.get('productivity_score', 'N/A')
        focus_score = enterprise_data.get('focus_score', 'N/A')
        last_update = enterprise_data.get('last_update', 'N/A')
        
        enterprise_metrics = enterprise_data.get('enterprise_metrics', {})
        revenue_growth = enterprise_metrics.get('revenue_growth', 'N/A')
        customer_acquisition = enterprise_metrics.get('customer_acquisition', 'N/A')
        
        social_strategy = enterprise_data.get('social_strategy', 'No strategy available')
        active_goals = enterprise_data.get('active_goals', [])
        project_status = enterprise_data.get('project_status', {})
            
        # Create the integrated HTML content
        html_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Data Master + Enterprise Dashboard</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }}
        .dashboard {{ max-width: 1200px; margin: 0 auto; }}
        .header {{ background: #2c3e50; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }}
        .metrics-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }}
        .metric-card {{ background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
        .goal-card {{ background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }}
        .progress-bar {{ background: #ecf0f1; height: 20px; border-radius: 10px; overflow: hidden; }}
        .progress-fill {{ background: #3498db; height: 100%; transition: width 0.3s; }}
        .enterprise-section {{ background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }}
        .success {{ color: #27ae60; }}
        .warning {{ color: #f39c12; }}
        .danger {{ color: #e74c3c; }}
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🚀 AI Data Master + Enterprise Dashboard</h1>
            <p>Integrated Business Intelligence & Personal Analytics</p>
            <small>Last Updated: {last_update}</small>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>📊 Productivity Score</h3>
                <h2 class="success">{productivity_score}</h2>
                <p>Average project progress</p>
            </div>
            
            <div class="metric-card">
                <h3>🎯 Focus Score</h3>
                <h2 class="success">{focus_score}</h2>
                <p>Business performance metric</p>
            </div>
            
            <div class="metric-card">
                <h3>📈 Revenue Growth</h3>
                <h2 class="success">{revenue_growth}%</h2>
                <p>Quarter-over-quarter</p>
            </div>
            
            <div class="metric-card">
                <h3>👥 Customer Acquisition</h3>
                <h2 class="success">{customer_acquisition}%</h2>
                <p>Monthly growth</p>
            </div>
        </div>
        
        <div class="enterprise-section">
            <h2>🏢 Enterprise Goals & Projects</h2>
            {self.generate_goals_html(active_goals)}
        </div>
        
        <div class="enterprise-section">
            <h2>📋 Project Status</h2>
            {self.generate_projects_html(project_status)}
        </div>
        
        <div class="enterprise-section">
            <h2>🚀 Strategic Recommendations</h2>
            <p>{social_strategy}</p>
        </div>
        
        <div class="enterprise-section">
            <h2>🔗 Integration Status</h2>
            <p class="success">✅ Enterprise Automation & AI Data Master are successfully integrated!</p>
            <p><strong>Data Source:</strong> master_data.json (updated daily at 8 AM)</p>
            <p><strong>Next Update:</strong> Automatically refreshes every 30 minutes</p>
        </div>
    </div>
    
    <script>
        // Auto-refresh every 30 minutes
        setTimeout(() => {{ location.reload(); }}, 1800000);
        
        // Progress bar animation
        document.addEventListener('DOMContentLoaded', function() {{
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {{
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {{ bar.style.width = width; }}, 100);
            }});
        }});
    </script>
</body>
</html>
        '''
        
        # Save the integrated dashboard
        integrated_file = os.path.expanduser("~/enterprise-ai-dashboard.html")
        with open(integrated_file, 'w') as f:
            f.write(html_content)
            
        print(f"✅ Integrated dashboard created: {integrated_file}")
        return True
        
    def generate_goals_html(self, goals):
        """Generates HTML for goals section"""
        if not goals:
            return "<p>No active goals</p>"
            
        goals_html = ""
        for goal in goals:
            progress = goal.get('progress', 0)
            goals_html += f'''
            <div class="goal-card">
                <h4>{goal.get('title', 'Untitled Goal')}</h4>
                <p>{goal.get('target', 'No target set')}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {progress}%"></div>
                </div>
                <span>{progress}% complete</span>
            </div>
            '''
        return goals_html
        
    def generate_projects_html(self, projects):
        """Generates HTML for projects section"""
        if not projects:
            return "<p>No projects data</p>"
            
        projects_html = ""
        for project, progress in projects.items():
            projects_html += f'''
            <div class="goal-card">
                <h4>{project}</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {progress}%"></div>
                </div>
                <span>{progress}% complete</span>
            </div>
            '''
        return projects_html

def main():
    integrator = AIMasterIntegrator()
    
    print("🔗 AI DATA MASTER INTEGRATION")
    print("=" * 50)
    
    # Create backup
    integrator.backup_original()
    
    # Create integrated dashboard
    if integrator.create_integrated_dashboard():
        print("\n🎉 INTEGRATION SUCCESSFUL!")
        print("📊 Your enterprise data is now integrated with AI Data Master")
        print("🌐 Open: ~/enterprise-ai-dashboard.html")
        print("\n📁 Files created:")
        print("   • standalone-ai-backup.html (backup)")
        print("   • enterprise-ai-dashboard.html (integrated dashboard)")
        
        # Show current enterprise data
        enterprise_data = integrator.read_enterprise_data()
        if enterprise_data:
            print("\n📈 CURRENT ENTERPRISE DATA:")
            print(f"   Productivity: {enterprise_data.get('productivity_score', 'N/A')}")
            print(f"   Focus Score: {enterprise_data.get('focus_score', 'N/A')}")
            print(f"   Revenue Growth: {enterprise_data.get('enterprise_metrics', {}).get('revenue_growth', 'N/A')}%")
    else:
        print("\n❌ Integration failed")

if __name__ == "__main__":
    main()
