import http.server
import socketserver
import json
from datetime import datetime
import random

class AIRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {"status": "healthy", "service": "AI Business Agent", "timestamp": datetime.now().isoformat()}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {"message": "🤖 AI Business Agent Running", "status": "online", "timestamp": datetime.now().isoformat()}
            self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        if self.path == '/api/ai/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode())
            user_message = request_data.get('message', '')
            responses = [
                "Your business shows excellent growth with $32K+ monthly revenue.",
                "Customer satisfaction at 4.9/5.0 indicates superb service quality.",
                "With 189 customers, you have strong foundation for expansion.",
                "Revenue trends are positive - consider scaling marketing efforts.",
                "Business analytics show all systems operational and trending upward."
            ]
            ai_response = random.choice(responses)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "response": ai_response,
                "user_message": user_message,
                "timestamp": datetime.now().isoformat(),
                "confidence": round(random.uniform(0.85, 0.98), 2)
            }
            self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

print("🚀 AI Business Agent starting on port 8080...")
with socketserver.TCPServer(("", 8080), AIRequestHandler) as httpd:
    print("✅ AI Agent running at: http://localhost:8080")
    print("📡 Ready to receive requests from your Render API")
    httpd.serve_forever()
