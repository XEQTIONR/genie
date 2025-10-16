<?php

use App\Http\Controllers\TeamController;
use App\Models\Team;
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

Route::get('/teams/{team:slug}', function(Team $team) {
    return Inertia::render('teams/show', [
        'team' => $team,
        'user_count' => $team->users()->count()
    ]);
})->name('teams.show');

Route::get('/teams/{team:slug}/members', function(Team $team) {
    $users = $team->users()->get();

    return Inertia::render('teams/show', [
        'team' => $team,
        'users' => $users,
        'user_count' => $users->count(),
        'tab' => 'members'
    ]);
})->name('teams.users.index');

Route::get('/profile/{user:username}/teams', function(User $user) {
    $teams = $user->teams()->withCount('users')->get();
    return Inertia::render('users/show', [
        'user' => $user,
        'teams' => $teams,
        'tab' => 'teams'
    ]);
})->name('users.teams.index');

Route::get('/', function () {
        return Inertia::render('dashboard');
})->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
