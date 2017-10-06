# Express middleware to aggregate requests

[![Build Status](https://travis-ci.org/evheniy/debitoor.svg?branch=master)](https://travis-ci.org/evheniy/debitoor)

## How to install

    git clone https://github.com/evheniy/debitoor.git
    cd debitoor
    npm i
    
## How to test

    npm t
    
## How to use

    const express = require('express');
    const middleware = require('...');
    
    app = express();
    app.use(middleware({
        source: 'http://localhost/',
        path: '/resources',
    }));

To get all requests into one run GET /resources?users=api/users&customer=api/customer/23&countries=api/countries 
