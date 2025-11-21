from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import requests
import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedAIBridge(BaseHTTPRequestHandler):
    
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
        if self.path == '/':
            response_data = {
                "message": "🤖 Enhanced AI Bridge - Business Context Enabled",
                "status": "online",
                "timestamp": datetime.datetime.now().isoformat()
            }
        elif self.path == '/business/dashboard':
            response_data = {
                "revenue": 32480.75,
                "customers": 189,
                "transactions_today": 47,
                "source": "enhanced_business_data"
            }
        elif self.path == '/business/customers':
            response_data = {
                "total_customers": 189,
                "active_today": 54,
                "satisfaction": 4.9,
                "source": "enhanced_customer_data"
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
        if self.path == '/ai/chat':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data)
                
                user_message = request_data.get('message', '')
                business_context = request_data.get('business_context', {})
                
                logger.info(f"💬 User message with business context: {user_message}")
                logger.info(f"📊 Business data: {business_context}")
                
                # Enhanced AI call with business context
                ai_response = self.call_ai_with_context(user_message, business_context)
                
                response_data = {
                    "response": ai_response,
                    "confidence": 0.95,
                    "source": "enhanced_ai_agent"
                }
                
                self.send_response(200)
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode())
                
            except Exception as e:
                logger.error(f"❌ Error: {e}")
                response_data = {"error": str(e)}
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
    
    def call_ai_with_context(self, user_message, business_context):
        """Enhanced AI call that includes business context"""
        try:
            # Build enhanced prompt with business context
            enhanced_prompt = f"""
User Question: {user_message}

Current Business Metrics:
- Revenue: ${business_context.get('revenue', 'N/A')}
- Total Customers: {business_context.get('customers', 'N/A')}
- Customer Satisfaction: {business_context.get('satisfaction', 'N/A')} ⭐
- Active Today: {business_context.get('active_today', 'N/A')}

Please provide specific, actionable advice based on these actual business metrics. Focus on practical recommendations and avoid generic responses.
"""
            
            ai_url = "http://localhost:8080/api/ai/chat"
            
            payload = {
                "message": enhanced_prompt,
                "max_tokens": 800  # Slightly longer for more detailed, contextual responses
            }
            
            response = requests.post(
                ai_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                response_data = response.json()
                return response_data.get("response", "No response received")
            else:
                return f"Based on your current metrics (Revenue: ${business_context.get('revenue')}, Customers: {business_context.get('customers')}), I recommend focusing on customer retention and revenue optimization strategies."
                
        except Exception as e:
            logger.error(f"AI call failed: {e}")
            return f"I understand your question about '{user_message}'. Given your business metrics, I suggest reviewing your customer satisfaction and exploring new growth channels."

def run_server():
    port = 8001
    server_address = ('', port)
    httpd = HTTPServer(server_address, EnhancedAIBridge)
    logger.info(f"🚀 Starting Enhanced AI Bridge on port {port}...")
    logger.info("📊 Business context integration enabled")
    logger.info("🌐 React App: http://localhost:3000")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
