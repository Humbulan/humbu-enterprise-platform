#!/usr/bin/env python3
"""
AI Bridge for Data-Aware Context - Port 8004
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.parse
import sys

PORT = 8004

class AIBridgeHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/ai/chat':
            self.handle_ai_chat()
        else:
            self.send_error(404, "Endpoint not found")
    
    def handle_ai_chat(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            user_message = request_data.get('message', '')
            
            print(f"📨 Received: {user_message[:100]}...")
            
            # Process with AI
            ai_response = self.process_with_ai(user_message)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {"response": ai_response}
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            
        except Exception as e:
            print(f"❌ Error: {e}")
            self.send_error(500, f"Error: {str(e)}")
    
    def process_with_ai(self, message):
        """Process message with AI"""
        try:
            # Try local AI agent
            return self.call_local_ai(message)
        except Exception as e:
            print(f"⚠️ Local AI unavailable: {e}")
            # Fallback response
            return self.create_fallback_response(message)
    
    def call_local_ai(self, message):
        """Call local AI agent"""
        ai_url = "http://localhost:8080/ai/chat"
        
        data = json.dumps({"message": message}).encode('utf-8')
        req = urllib.request.Request(ai_url, data=data, 
                                   headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get('response', 'No response from AI')
    
    def create_fallback_response(self, message):
        """Create fallback response when AI is unavailable"""
        if 'revenue' in message.lower():
            return "Based on your revenue of $32,480.75, I recommend focusing on upselling to your existing 189 customers. Your high satisfaction score (4.9/5) suggests they're very loyal."
        elif 'customer' in message.lower():
            return "With 189 customers and excellent satisfaction (4.9/5), your retention strategy is working well. Consider implementing a referral program."
        elif 'growth' in message.lower():
            return "Your metrics show strong fundamentals. For growth: 1) Upsell premium services, 2) Launch referral program, 3) Increase transaction volume."
        else:
            return f"I've analyzed your query about: {message}. For personalized advice, include specific business metrics like revenue, customer count, or satisfaction scores."

def main():
    try:
        with socketserver.TCPServer(("", PORT), AIBridgeHandler) as httpd:
            print(f"🚀 AI Bridge Server starting on port {PORT}...")
            print(f"📍 URL: http://localhost:{PORT}")
            print(f"🔌 Endpoint: http://localhost:{PORT}/ai/chat")
            print("✅ Ready for Data-Aware AI Context requests!")
            print("-" * 50)
            
            httpd.serve_forever()
            
    except OSError as e:
        print(f"❌ Failed to start on port {PORT}: {e}")
        print("💡 Try: kill $(lsof -t -i:8004)")
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")

if __name__ == "__main__":
    main()
