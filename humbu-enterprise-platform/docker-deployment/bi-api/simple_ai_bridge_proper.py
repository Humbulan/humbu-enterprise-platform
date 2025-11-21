from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import requests
import datetime
from urllib.parse import urlparse, parse_qs
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimpleAIBridge(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
    
    def do_GET(self):
        logger.info(f"📨 GET request: {self.path}")
        
        if self.path == '/':
            response_data = {
                "message": "🤖 Simple AI Bridge - Mobile App Ready",
                "status": "online",
                "timestamp": datetime.datetime.now().isoformat(),
                "endpoints": ["/business/dashboard", "/business/customers", "/ai/chat", "/status"]
            }
        elif self.path == '/business/dashboard':
            response_data = {
                "revenue": 32480.75,
                "customers": 189,
                "transactions_today": 47,
                "source": "simulated_business_data"
            }
        elif self.path == '/business/customers':
            response_data = {
                "total_customers": 189,
                "active_today": 54,
                "satisfaction": 4.9,
                "source": "simulated_customer_data"
            }
        elif self.path == '/status':
            response_data = {
                "bridge_status": "online",
                "ai_agent_status": "checking...",
                "timestamp": datetime.datetime.now().isoformat()
            }
        else:
            response_data = {"error": "Endpoint not found"}
            self.send_response(404)
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            return
        
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode())
    
    def do_POST(self):
        logger.info(f"📨 POST request: {self.path}")
        
        if self.path == '/ai/chat':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data)
                
                user_message = request_data.get('message', '')
                logger.info(f"💬 User message: {user_message}")
                
                # Call the AI agent with PROPER formatting
                ai_response = self.call_ai_agent(user_message)
                
                response_data = {
                    "response": ai_response,
                    "confidence": 0.95,
                    "source": "local_ai_agent"
                }
                
                self.send_response(200)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode())
                
            except Exception as e:
                logger.error(f"❌ Error in AI chat: {e}")
                response_data = {
                    "response": f"Error processing request: {str(e)}",
                    "confidence": 0.0,
                    "source": "error"
                }
                self.send_response(500)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode())
        else:
            response_data = {"error": "Endpoint not found"}
            self.send_response(404)
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
    
    def call_ai_agent(self, user_message):
        """Properly call the AI agent with correct API formatting"""
        try:
            # Test if AI agent is accessible first
            health_check = requests.get("http://localhost:8080/health", timeout=5)
            if health_check.status_code != 200:
                return "AI agent is not responding properly. Please check if it's running on port 8080."
            
            # PROPER API call to the AI agent
            # Using the correct endpoint and format for your AI agent
            ai_url = "http://localhost:8080/api/ai/chat"
            
            # Proper request format for AI agent
            payload = {
                "message": user_message,
                "context": "business_intelligence",
                "format": "text"  # Explicitly request text, not HTML
            }
            
            logger.info(f"🤖 Calling AI agent at: {ai_url}")
            logger.info(f"📤 Payload: {payload}")
            
            response = requests.post(
                ai_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            logger.info(f"📥 AI response status: {response.status_code}")
            
            if response.status_code == 200:
                response_data = response.json()
                logger.info(f"✅ AI response data: {response_data}")
                
                # Extract the actual response text
                if isinstance(response_data, dict):
                    ai_text = response_data.get("response", "")
                    # If it's still HTML, provide a fallback
                    if ai_text.strip().startswith("<!DOCTYPE html>") or ai_text.strip().startswith("<html"):
                        return f"I understand you're asking about: '{user_message}'. For detailed business analysis, please rephrase your question to be more specific about business strategy, revenue, customers, or growth opportunities."
                    return ai_text
                else:
                    return str(response_data)
            else:
                logger.warning(f"⚠️ AI agent returned status {response.status_code}")
                return f"I received your question about '{user_message}'. The AI agent is currently processing other requests. Please try again in a moment."
                
        except requests.exceptions.ConnectionError:
            logger.error("❌ Cannot connect to AI agent on port 8080")
            return "The AI business advisor is currently unavailable. Please ensure the AI agent is running on port 8080 and try again."
        except requests.exceptions.Timeout:
            logger.error("❌ AI agent request timeout")
            return "The AI is taking longer than expected to respond. Please try again with a simpler question."
        except Exception as e:
            logger.error(f"❌ Unexpected error calling AI agent: {e}")
            return f"I understand you're asking about business strategy. Currently, I'm experiencing technical difficulties. Please try again shortly or ask about: revenue trends, customer satisfaction, or growth opportunities."

def run_server():
    port = 8001
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleAIBridge)
    logger.info(f"🚀 Starting Proper AI Bridge on port {port}...")
    logger.info(f"📱 Mobile apps can connect to: http://localhost:{port}")
    logger.info(f"🤖 Local AI: http://localhost:8080")
    logger.info("🎯 PROPER AI communication configured!")
    logger.info("✅ Bridge will now send properly formatted requests to AI agent")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
