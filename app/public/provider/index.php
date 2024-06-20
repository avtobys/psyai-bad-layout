<?php

require __DIR__ . '/../../include/core.php';

ob_start();
session_start();

require __DIR__ . '/../../routes/api.php';
require __DIR__ . '/../../routes/web.php';

\App\Http\Route::dispatch($_SERVER['REQUEST_METHOD'], strtok($_SERVER['REQUEST_URI'], '?'));


// use App\Models\Account;

// $account = new Account();
// $account->type_ids = [1, 2, 3];
// $account->password_hash = 'somehash';
// $account->balance = 100.50;
// $account->created_at = now();
// $account->online_at = now();
// $account->is_active = true;
// $account->save();

// dd(Account::find(1));

