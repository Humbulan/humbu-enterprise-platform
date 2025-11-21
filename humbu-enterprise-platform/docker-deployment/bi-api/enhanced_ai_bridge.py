#!/usr/bin/env python3
"""
Enhanced AI Bridge with Data-Aware Context Support
Automatically handles port conflicts and provides better error messages
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.parse
import sys
import time

class EnhancedAIBridgeHandler(http.server.SimpleHTTPRequestHandler):
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
            
            print(f"📨 Received message: {user_message[:100]}...")
            
            # Enhanced context-aware processing
            ai_response = self.process_with_ai(user_message)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "response": ai_response,
                "status": "success",
                "context_used": "business_metrics" in user_message.lower()
            }
            
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            
        except Exception as e:
            print(f"❌ Error processing request: {e}")
            self.send_error(500, f"Internal server error: {str(e)}")
    
    def process_with_ai(self, message):
        """Enhanced AI processing with context awareness"""
        
        # Check if message contains business context
        has_business_context = any(keyword in message.lower() for keyword in 
                                 ['revenue', 'customer', 'satisfaction', 'transaction', 'business context'])
        
        try:
            # Try local AI agent first
            return self.call_local_ai(message)
        except Exception as e:
            print(f"⚠️ Local AI unavailable: {e}")
            # Fallback to simulated response
            return self.create_simulated_response(message, has_business_context)
    
    def call_local_ai(self, message):
        """Call the local AI agent"""
        ai_url = "http://localhost:8080/ai/chat"
        
        data = json.dumps({"message": message}).encode('utf-8')
        req = urllib.request.Request(ai_url, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get('response', 'No response from AI')
    
    def create_simulated_response(self, message, has_context=False):
        """Create a simulated AI response for testing"""
        
        if has_context:
            # Context-aware responses
            if 'revenue' in message.lower():
                return "Based on your revenue of $32,480.75, I recommend focusing on upselling to your existing 189 customers. Your high satisfaction score (4.9/5) suggests they're very loyal and likely to purchase additional services."
            elif 'customer' in message.lower():
                return "With 189 customers and excellent satisfaction (4.9/5), your retention strategy is working well. Consider implementing a referral program to leverage your happy customers for new acquisitions."
            elif 'growth' in message.lower():
                return "Your metrics show strong fundamentals. For growth, I'd recommend: 1) Upsell premium services to existing customers, 2) Launch referral program, 3) Target 20% increase in transaction volume through marketing."
            else:
                return f"I've analyzed your business metrics (Revenue: $32,480.75, Customers: 189, Satisfaction: 4.9/5). {message} - Given your strong customer satisfaction, focus on retention and upselling strategies."
        else:
            # Generic responses
            return f"Simulated AI response to: {message}. For data-aware insights, include your business metrics in the question."

def find_available_port(start_port=8001, max_attempts=10):
    """Find an available port starting from start_port"""
    for port in range(start_port, start_port + max_attempts):
        try:
            with socketserver.TCPServer(("", port), EnhancedAIBridgeHandler) as httpd:
                httpd.server_close()
                return port
        except OSError:
            continue
    return None

def main():
    # Get port from command line or find available one
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid port number. Using automatic port detection.")
            port = find_available_port()
    else:
        port = find_available_port()
    
    if port is None:
        print("❌ Could not find an available port after 10 attempts")
        sys.exit(1)
    
    try:
        with socketserver.TCPServer(("", port), EnhancedAIBridgeHandler) as httpd:
            print(f"🚀 ENHANCED AI Bridge Server starting on port {port}...")
            print(f"📍 Access URL: http://localhost:{port}")
            print(f"🔌 AI Chat Endpoint: http://localhost:{port}/ai/chat")
            print(f"🎯 Features: Data-Aware Context, Fallback Responses, CORS Enabled")
            print("✅ Server is running and ready for Data-Aware AI Context requests!")
            print("-" * 60)
            
            httpd.serve_forever()
            
    except OSError as e:
        print(f"❌ Failed to start server on port {port}: {e}")
        print("💡 Try a different port: python3 enhanced_ai_bridge.py 8004")
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")

if __name__ == "__main__":
    main()
