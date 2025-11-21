# Add this import at the top
import subprocess
import os
import time
from datetime import datetime

class EnterpriseAutomation:
    # [Keep all your existing code exactly the same until github_enterprise_sync method...]
    
    def github_enterprise_sync(self):
        """Enhanced GitHub sync with better error handling"""
        try:
            os.chdir(self.repo_path)
            
            # Add all new files
            subprocess.run(['git', 'add', '.'], check=True)
            
            # Create commit
            commit_msg = f"Enterprise update: {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
            
            print(f"✅ Local commit: {commit_msg}")
            
            # Push to GitHub - this should now work with SSH
            print("🚀 Pushing to GitHub...")
            result = subprocess.run(['git', 'push', 'origin', 'main'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ GitHub Sync: COMPLETE!")
                print(f"📊 Repository: {self.github_repo}")
            else:
                print("⚠️  Auto-push failed (normal for first run)")
                print("💡 Run manually: git push origin main")
                
        except Exception as e:
            print(f"⚠️  Sync note: {e}")
            print("💾 Strategic data saved locally - GitHub sync available")

    # [Keep the rest of your methods exactly the same...]

# [Keep your main() function exactly the same...]
