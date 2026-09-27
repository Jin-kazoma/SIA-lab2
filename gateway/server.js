const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { timeStamp } = require('node:console');

const app = express();
const PORT = 3000;

// SERVICE URLs (THE SPOKES)

const SERVICES = {
    users: 'http://localhost:5001/users',
    products: 'http://localhost:5002/products',
    orders: 'http://localhost:5003/orders'
};


// MIDDLEWARE

app.use(cors()); // allow cross-origin requests
app.use(express.json()); // Parse JSON bodies


//ROUTE 1: Dashboard - Aggregates all services
app.get('/api/dashboard', async (req, res) =>{
    console.log('Dashboard requested - aggregating data...');

     try{
        //call all service in parallel(promise.all)
        const [userRes, productsRes, ordersRes] = await 
        Promise.all([
            axios.get(SERVICES.users),
            axios.get(SERVICES.products),
            axios.get(SERVICES.orders)
        ]);

        // Combine all data into one response 
        const dashboard = {
            timeStamp: new Date().toISOString(),
            summary: {
                totalUsers: userRes.data.count || 0,
                totalProducts: productsRes.data.count || 0,
                totalOrders: ordersRes.data.count || 0
            },
            users: userRes.data.data || [],
            products: productsRes.data.data || [],
            orders: ordersRes.data.data || []
        };

        console.log(`Dashboard: 
            ${dashboard.summary.totalUsers} users,
            ${dashboard.summary.totalProducts} products,
            ${dashboard.summary.totalOrders} orders`);
                res.json(dashboard);

     } catch(error){
        console.error('Aggregation error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch data from one or more services',
             details: error.message
        });
     }
});


//ROUTE 2:  check service status

app.get('/api/status', async (req, res) => {
    try{
        const results = await Promise.all([ 
            axios.get('http://localhost:5001/ping').then(() => 
                ({ name: 'users', status: 'online' })).catch(() => ({ name:'users', status: 'offline' })), 

             axios.get('http://localhost:5002/ping').then(() => 
                ({ name: 'products', status: 'online' })).catch(() => ({ name:'products', status: 'offline' })), 

            axios.get('http://localhost:5003/ping').then(() => 
                ({ name: 'orders', status: 'online' })).catch(() => ({ name:'orders', status: 'offline' })) 
        ]); 

        const allOnline = results.every(s => s.status === 'online'); 
            res.json({ gateway: 'online', allOnline: allOnline, services: results }); 
    } catch(error){
        res.status(500).json({ error: 'Status check failed'});
    }
});


//ROUTE 3: indvidual service endpoints

app.get('/api/users', async (req, res) => { 
    try { const response = await axios.get(SERVICES.users); 
        res.json(response.data); 
    } catch (error) { 
        res.status(500).json({ error: 'Failed to fetch users'}); 
    }
}); 

app.get('/api/products', async (req, res) => { 
    try { const response = await axios.get(SERVICES.products); 
        res.json(response.data); 
    } catch (error) { 
        res.status(500).json({ error: 'Failed to fetch products'}); 
    }
}); 

app.get('/api/orders', async (req, res) => { 
    try { const response = await axios.get(SERVICES.orders); 
        res.json(response.data); 
    } catch (error) { 
        res.status(500).json({ error: 'Failed to fetch orders'}); 
    }
}); 


//START THE GATEWAY
app.listen(PORT, () => { 
    console.log('=' .repeat(50)); 
    console.log('API GATEWAY (HUB) STARTED'); 
    console.log('=' .repeat(50)); 
    console.log(`Gateway URL: http://localhost:${PORT}`); 
    console.log('=' .repeat(50)); 
    console.log('ENDPOINTS:'); 
    console.log(`Dashboard:http://localhost:${PORT}/api/dashboard`); 
    console.log(`Status:http://localhost:${PORT}/api/status`); 
    console.log(`Users:http://localhost:${PORT}/api/users`); 
    console.log(`Products:http://localhost:${PORT}/api/products`); 
    console.log(`Orders:http://localhost:${PORT}/api/orders`); 
    console.log('=' .repeat(50)); 
    console.log('All services will be called in PARALLEL!'); 
    console.log('Open Postman and test the endpoints.'); 
}); 