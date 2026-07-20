<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This determines what cross-origin operations may execute in web browsers.
    |
    */

    // This allows CORS on all API routes and the Sanctum cookie route
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Allows all HTTP methods (GET, POST, PUT, DELETE)
    'allowed_methods' => ['*'],

    // ONLY allow your React application to talk to the backend
    'allowed_origins' => [
        'http://localhost:5173', 
        'http://127.0.0.1:5173'
    ],

    'allowed_origins_patterns' => [],

    // Allows all headers (Authorization, Content-Type, etc.)
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // SET TO TRUE: This is mandatory for sending the Auth token/cookies
    'supports_credentials' => true,

];