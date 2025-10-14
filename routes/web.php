<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

});

Route::get('/profile/{user:username}', function(User $user) {
    return Inertia::render('profile', compact('user'));
})->name('users.show');

Route::get('/', function () {
        return Inertia::render('dashboard');
})->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
