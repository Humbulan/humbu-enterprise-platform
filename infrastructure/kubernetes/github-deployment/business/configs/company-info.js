// HUMBU WANDEME TRADING ENTERPRISE Configuration
const COMPANY_CONFIG = {
    name: "HUMBU WANDEME TRADING ENTERPRISE",
    email: "humbulani@humbu.store", 
    phone: "079 465 8481",
    domain: "humbu.store",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    
    payment: {
        stripe: false,
        paypal: true,
        paypalEmail: "humbulani@humbu.store"
    },
    
    services: {
        starter: { price: 499, name: "Starter Container Setup" },
        professional: { price: 1299, name: "Professional Container Solution" },
        enterprise: { price: 2999, name: "Enterprise Full Architecture" }
    }
};
