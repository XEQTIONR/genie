<?php

use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
});

Route::get('/profile/{user:username}', function(User $user) {
    return Inertia::render('users/show', [
        'user' => $user,
        'tab' => 'showcase'
    ]);
})->name('users.show');

Route::get('/profile/{user:username}/teams', function(User $user) {
    $teams = $user->ownedTeams;
    return Inertia::render('users/show', [
        'user' => $user,
        'teams' => $teams,
        'tab' => 'teams'
    ]);
})->name('users.teams.show');

Route::get('/', function () {
        return Inertia::render('dashboard');
})->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
