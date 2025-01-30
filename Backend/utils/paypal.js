import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PAYPAL_API = process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'; // Sandbox or Live API
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;

// Function to get an access token from PayPal
const getAccessToken = async () => {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch PayPal access token: ${errorData.error_description}`);
    }

    const data = await response.json();
    return data.access_token;
};

// Function to create an order for ticket purchase
export const createOrder = async (totalPrice) => {
    const accessToken = await getAccessToken();
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    description: 'Ticket Purchase', // Describe transaction
                    amount: {
                        currency_code: 'USD', // currency
                        value: totalPrice.toFixed(2),
                    },
                },
            ],
            application_context: {
                brand_name: 'Ticket Backend', 
                landing_page: 'LOGIN', 
                user_action: 'PAY_NOW', 
                return_url: 'http://localhost:6000/api/paypal/complete-order', 
                cancel_url: 'http://localhost:6000/api/paypal/cancel', 
            },
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create PayPal order: ${errorData.message}`);
    }

    const orderData = await response.json();
    return orderData;
};

// Function to capture a payment for ticket purchase
export const capturePayment = async (token) => {
    const accessToken = await getAccessToken();
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to capture PayPal payment: ${errorData.message}`);
    }

    const captureData = await response.json();
    return captureData;
};



// application_context: {
//     brand_name: 'Your App Name', // Displayed to the user on PayPal
//     landing_page: 'LOGIN', // Or 'BILLING' if you want to show card details first
//     user_action: 'PAY_NOW', // Makes the button say "Pay Now"
//     return_url: 'https://yourdomain.com/api/orders/complete', // Redirect after approval
//     cancel_url: 'https://yourdomain.com/api/orders/cancel',  // Redirect if cancelled
// },