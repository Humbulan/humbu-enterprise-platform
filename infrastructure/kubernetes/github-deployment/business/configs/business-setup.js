// Container Solutions Pro - Business Configuration
const BUSINESS_CONFIG = {
    company: {
        name: "Container Solutions Pro",
        tagline: "Enterprise Containerization Experts", 
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
        contact: {
            email: "solutions@containerpro.com",
            phone: "+1-555-CONTAINER",
            website: "https://containerpro.com"
        }
    },
    
    packages: {
        starter: {
            name: "Starter Package",
            price: "$499",
            features: [
                "Docker Configuration",
                "Basic docker-compose.yml", 
                "Deployment Guide",
                "30 Days Support"
            ]
        },
        professional: {
            name: "Professional Package",
            price: "$1,299", 
            features: [
                "Kubernetes Manifests",
                "CI/CD Pipeline Setup",
                "Monitoring Configuration",
                "Security Hardening",
                "90 Days Support"
            ]
        },
        enterprise: {
            name: "Enterprise Package", 
            price: "$2,999",
            features: [
                "Multi-cluster Architecture",
                "Advanced Security & Compliance",
                "Disaster Recovery Setup",
                "Performance Optimization", 
                "24/7 Premium Support",
                "Custom Integrations"
            ]
        }
    }
};

console.log("🚀 Business Configuration Loaded");
