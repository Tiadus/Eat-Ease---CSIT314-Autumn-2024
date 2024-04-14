const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cors = require('cors');

const ServiceCustomer = require('./class_controller/ServiceCustomer.js');
const ServiceRestaurant = require('./class_controller/ServiceRestaurant.js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/api/customer/register', async (req,res) => {
    const body = req.body;
    const customerEmail = body.customerEmail;
    const customerName = body.customerName;
    const customerPhone = body.customerPhone;
    const customerPassword = body.customerPassword;

    if (customerEmail === undefined || customerName === undefined || customerPhone === undefined || customerPassword === undefined) {
        return res.send("Wrong Parameter");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        const newCustomerCode = await serviceCustomer.registerCustomer(customerEmail, customerName, customerPhone, customerPassword);
        res.json({customerCode: newCustomerCode});
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/login', async (req,res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    if (customerEmail === undefined || customerPassword === undefined) {
        return res.send("Wrong Parameter");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        const customerInformation = await serviceCustomer.getCustomerInformation();

        res.json(customerInformation)
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.get('/api/customer/information', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    if (customerEmail === undefined || customerPassword === undefined) {
        return res.send("Wrong Parameter");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        const customerInformation = await serviceCustomer.getCustomerInformation();

        res.json(customerInformation);
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/edit/email', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    const newEmail = req.body.newEmail;

    if (newEmail === undefined) {
        return res.send("Wrong Parameter");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        await serviceCustomer.setCustomerInformation(newEmail, null, null);

        res.status(200).send({ message: 'Email Successfully Changed' });
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/edit/phone', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    const newPhone = req.body.newPhone;

    if (newPhone === undefined) {
        return res.send("Wrong Parameter");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        await serviceCustomer.setCustomerInformation(null, newPhone, null);

        res.status(200).send({ message: 'Phone Successfully Changed' });
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/edit/password', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    const newPassword = req.body.newPassword;

    if (newPassword === undefined) {
        return res.send("Wrong Parameter");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        await serviceCustomer.setCustomerInformation(null, null, newPassword);

        res.status(200).send({ message: 'Password Successfully Changed' });
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/membership/subscribe', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    const sct = req.body.sct;

    if (sct === undefined) {
        return res.send("Wrong Parameter");
    }

    const subcribtionType = parseInt(sct);

    if (subcribtionType !== 0 && subcribtionType !== 1) {
        return res.send("Wrong Type");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        const newMembershipDate = await serviceCustomer.customerSubcribeMembership(subcribtionType);
        res.json({
            subcribtionType: subcribtionType,
            membershipEnd: newMembershipDate
        })
    } catch(error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/membership/renew', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        const newMembershipDate = await serviceCustomer.customerRenewMembership();

        res.json(newMembershipDate);
    } catch(error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/membership/cancel', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        await serviceCustomer.customerCancelMembership();

        res.status(200).send({ message: 'Membership Successfully Canceled' });
    } catch(error) {
        res.status(error.status).json({error: error.message});
    }
});

app.get('/api/customer/payment/view', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        const customerPaymentMethods = await serviceCustomer.getCustomerPaymentMethods();

        res.json(customerPaymentMethods);
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/payment/add', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    const cardNumber = req.body.cn;
    const cardOwner = req.body.co;
    const cardExpMonth = req.body.em;
    const cardExpYear = req.body.ey;

    if (cardNumber === undefined || cardOwner === undefined || cardExpMonth === undefined || cardExpYear === undefined) {
        return res.send("Wrong Parameter");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        await serviceCustomer.addCustomerPaymentMethod(cardNumber, cardOwner, cardExpMonth, cardExpYear);

        res.status(200).send({ message: 'Payment Method Successfully Added' });
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.post('/api/customer/payment/delete', async (req, res) => {
    const authen = req.headers.authorization;
    if (authen === undefined) {
        return res.send("Server Unavailable");
    }

    const encodedCredential = authen.split(" ")[1];
    const decodedCredential = atob(encodedCredential);

    const authenParts = decodedCredential.split(":");
    const customerEmail = authenParts[0];
    const customerPassword = authenParts[1];

    const paymentCode = req.body.pc;

    if (paymentCode === undefined) {
        return res.send("Wrong Parameter");
    }

    try {
        const serviceCustomer = new ServiceCustomer();
        await serviceCustomer.authenticateCustomer(customerEmail, customerPassword);
        await serviceCustomer.deleteCustomerPaymentMethod(paymentCode);

        res.status(200).send({ message: 'Payment Method Successfully Deleted' });
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.get('/api/restaurants', async (req,res) => {
    const keyword = req.query.kw;
    if (keyword === undefined) {
        return res.send("Server Unavailable");
    }

    let ratingLowerBound = req.query.rlb;
    let radius = req.query.r;
    let cusLat = req.query.lat;
    let cusLon = req.query.lon;

    if (ratingLowerBound !== undefined) {
        if (isNaN(ratingLowerBound) === false) {
            ratingLowerBound = parseInt(ratingLowerBound);
        } else {
            return res.send("Wrong Parameter");
        }
    }

    if (radius !== undefined) {
        if (cusLat === undefined || cusLon === undefined) {
            return res.send("Wrong Parameter");
        }

        if (isNaN(radius) === false) {
            radius = parseInt(radius);
        } else {
            return res.send("Wrong Parameter");
        }

        if (isNaN(cusLat) === false) {
            cusLat = parseFloat(cusLat);
        } else {
            return res.send("Wrong Parameter");
        }

        if (isNaN(cusLon) === false) {
            cusLon = parseFloat(cusLon);
        } else {
            return res.send("Wrong Parameter");
        }
    }

    try {
        const serviceRestaurant = new ServiceRestaurant();
        const restaurants = await serviceRestaurant.getRestaurants(keyword, null, ratingLowerBound, radius, cusLat, cusLon);
        res.json(restaurants);
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.get('/api/categories', async (req,res) => {
    try {
        const serviceRestaurant = new ServiceRestaurant();
        const categories = await serviceRestaurant.getRestaurantCategories();;
        res.json(categories);
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.get('/api/restaurants/?:category', async (req,res) => {
    const category = req.params.category;

    if (category === undefined) {
        return res.send("Server Unavailable");
    }

    let ratingLowerBound = req.query.rlb;
    let radius = req.query.r;
    let cusLat = req.query.lat;
    let cusLon = req.query.lon;

    if (ratingLowerBound !== undefined) {
        if (isNaN(ratingLowerBound) === false) {
            ratingLowerBound = parseInt(ratingLowerBound);
        } else {
            return res.send("Wrong Parameter");
        }
    }

    if (radius !== undefined) {
        if (cusLat === undefined || cusLon === undefined) {
            return res.send("Wrong Parameter");
        }

        if (isNaN(radius) === false) {
            radius = parseInt(radius);
        } else {
            return res.send("Wrong Parameter");
        }

        if (isNaN(cusLat) === false) {
            cusLat = parseFloat(cusLat);
        } else {
            return res.send("Wrong Parameter");
        }

        if (isNaN(cusLon) === false) {
            cusLon = parseFloat(cusLon);
        } else {
            return res.send("Wrong Parameter");
        }
    }

    try {
        const serviceRestaurant = new ServiceRestaurant();
        const restaurants = await serviceRestaurant.getRestaurants(null, category, ratingLowerBound, radius, cusLat, cusLon);
        res.json(restaurants);
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

app.get('/api/restaurant/?:restaurantName', async (req, res) => {
    const restaurantName = req.params.restaurantName;

    if (restaurantName === undefined) {
        res.send("Server Unavailable");
    }

    try {
        const serviceRestaurant = new ServiceRestaurant();
        const restaurantMenu = await serviceRestaurant.getRestaurantMenu(restaurantName);
        res.json(restaurantMenu);
    } catch (error) {
        res.status(error.status).json({error: error.message});
    }
});

server.listen(4000, function() {
    console.log("Listening on port 4000");
});