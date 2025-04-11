import fetch from 'node-fetch';
import dotenv from 'dotenv';


dotenv.config();

const PAYPAL_API = process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'; 
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;


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
                    description: 'Ticket Purchase',
                    amount: {
                        currency_code: 'USD', 
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



