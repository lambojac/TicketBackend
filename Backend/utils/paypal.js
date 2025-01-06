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
