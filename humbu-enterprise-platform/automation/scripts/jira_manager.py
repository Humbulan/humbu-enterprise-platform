#!/usr/bin/env python3
import json
from datetime import datetime, timedelta

class JiraProjectManager:
    def __init__(self):
        self.projects_file = "jira_projects.json"
        self.setup_sample_projects()
    
    def setup_sample_projects(self):
        """Create sample project structure"""
        projects = {
            "business_development": {
                "name": "Business Growth Initiative",
                "sprints": [
                    {
                        "name": "Sprint 1 - Market Expansion",
                        "start_date": datetime.now().strftime("%Y-%m-%d"),
                        "end_date": (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d"),
                        "tasks": [
                            {"id": "BD-1", "name": "Competitor Analysis", "status": "In Progress", "priority": "High"},
                            {"id": "BD-2", "name": "Customer Survey", "status": "To Do", "priority": "Medium"},
                            {"id": "BD-3", "name": "Marketing Strategy", "status": "To Do", "priority": "High"}
                        ]
                    }
                ]
            },
            "product_development": {
                "name": "New Product Launch",
                "sprints": [
                    {
                        "name": "Sprint 1 - MVP Development", 
                        "start_date": datetime.now().strftime("%Y-%m-%d"),
                        "end_date": (datetime.now() + timedelta(days=21)).strftime("%Y-%m-%d"),
                        "tasks": [
                            {"id": "PD-1", "name": "Feature Planning", "status": "Done", "priority": "High"},
                            {"id": "PD-2", "name": "UI/UX Design", "status": "In Progress", "priority": "High"},
                            {"id": "PD-3", "name": "Backend Development", "status": "To Do", "priority": "Medium"}
                        ]
                    }
                ]
            }
        }
        
        with open(self.projects_file, 'w') as f:
            json.dump(projects, f, indent=2)
    
    def daily_standup(self):
        """Generate daily standup report"""
        print(f"\n📋 DAILY JIRA STANDUP - {datetime.now().strftime('%Y-%m-%d')}")
        print("=" * 60)
        
        try:
            with open(self.projects_file, 'r') as f:
                projects = json.load(f)
            
            for project_key, project in projects.items():
                print(f"\n🏢 PROJECT: {project['name']}")
                print("-" * 40)
                
                for sprint in project['sprints']:
                    print(f"📅 Sprint: {sprint['name']}")
                    print(f"   📍 Period: {sprint['start_date']} to {sprint['end_date']}")
                    
                    for task in sprint['tasks']:
                        status_icon = "✅" if task['status'] == 'Done' else "🔄" if task['status'] == 'In Progress' else "📝"
                        priority_icon = "🔴" if task['priority'] == 'High' else "🟡" if task['priority'] == 'Medium' else "🟢"
                        
                        print(f"   {status_icon} {priority_icon} {task['id']}: {task['name']}")
                        print(f"      Status: {task['status']} | Priority: {task['priority']}")
        
        except Exception as e:
            print(f"❌ Error loading projects: {e}")
        
        print("\n🎯 TODAY'S FOCUS:")
        print("• Complete high-priority tasks")
        print("• Update task status regularly")
        print("• Communicate blockers immediately")
        print("• Review sprint progress")
    
    def create_new_task(self, project_key, task_data):
        """Add new task to project"""
        try:
            with open(self.projects_file, 'r') as f:
                projects = json.load(f)
            
            if project_key in projects:
                projects[project_key]['sprints'][0]['tasks'].append(task_data)
                
                with open(self.projects_file, 'w') as f:
                    json.dump(projects, f, indent=2)
                
                print(f"✅ Task {task_data['id']} added to {project_key}")
            else:
                print("❌ Project not found")
        
        except Exception as e:
            print(f"❌ Error adding task: {e}")

def main():
    manager = JiraProjectManager()
    manager.daily_standup()

if __name__ == "__main__":
    main()
