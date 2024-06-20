<?php

require __DIR__ . '/../../include/core.php';

ob_start();
session_start();

require __DIR__ . '/../../routes/api.php';
require __DIR__ . '/../../routes/web.php';

\App\Http\Route::dispatch($_SERVER['REQUEST_METHOD'], strtok($_SERVER['REQUEST_URI'], '?'));
