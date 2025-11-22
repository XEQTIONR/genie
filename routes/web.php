<?php

use App\Http\Controllers\JobController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectInvitationController;
use App\Http\Controllers\ProjectJobController;
use App\Http\Controllers\ProjectMembershipController;
use App\Http\Controllers\ProjectOpeningController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\UserProfileController;
use App\Http\Resources\JobPostingResource;
use App\Models\JobOpening;
use App\Models\Team;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Support\Facades\Auth;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::get('/teams/create', [TeamController::class, 'create'])->name('teams.create');
    
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project:slug}/members/create', [ProjectMembershipController::class, 'create'])
        ->name('projects.members.create');
    Route::post('/projects/{project:slug}/members', [ProjectMembershipController::class, 'store'])
        ->name('project.members.store');

    //Route::get('/projects/{project:slug}/job-openings', [ProjectJobController::class, 'index'])->name('projects.jobs.index');

    Route::get('/jobs/create', [JobController::class, 'create'])->name('jobs.create');
    Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');

    Route::patch('/profile/{user}', [UserProfileController::class, 'update'])->name('users.update');

    Route::patch('/teams/{team}', [TeamController::class, 'update'])->name('teams.update');
});

Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/projects/invitations/{invitation}', [ProjectInvitationController::class, 'show'])->name('projectInvitation.show');
Route::put('/projects/invitations/{invitation}', [ProjectInvitationController::class, 'update'])->name('projectInvitation.update');
Route::get('/teams/invitations/{invitation}', [TeamInvitationController::class, 'show'])->name('teamInvitation.show');
Route::put('/teams/invitations/{invitation}', [TeamInvitationController::class, 'update'])->name('teamInvitation.update');

Route::get('/profile/{user:username}', function(User $user) {
    return Inertia::render('users/show', [
        'user' => $user,
        'tab' => 'showcase'
    ]);
})->name('users.show');

Route::get('/profile/{user:username}/about', function(User $user) {
    $user->load(['ownedProjects']);
    return Inertia::render('users/show', [
        'user' => $user,
        'tab' => 'about'
    ]);
})->name('users.about');

Route::get('/profile/{user:username}/teams', function(User $user) {
    $teams = $user->teams()->withCount(['users', 'projects'])->get();
    return Inertia::render('users/show', [
        'user' => $user,
        'teams' => $teams,
        'tab' => 'teams'
    ]);
})->name('users.teams.index');

Route::get('/teams/{team:slug}', [TeamController::class, 'index'])->name('teams.show');

Route::get('/teams/{team:slug}/members', function(Team $team) {
    $users = $team->users()->get();

    return Inertia::render('teams/show', [
        'team' => $team,
        'users' => $users,
        'user_count' => $users->count(), // cache this later
        'tab' => 'members'
    ]);
})->name('teams.users.index');

Route::get('/teams/{team:slug}/projects', function(Team $team) {
    $projects = $team->projects()->get();

    return Inertia::render('teams/show', [
        'team' => $team,
        'projects' => $projects,
        'user_count' => $team->users()->count(), // cache this later
        'tab' => 'projects'
    ]);
})->name('teams.projects.index');

Route::get('/teams/{team:slug}/jobs', function (Team $team) {
    return Inertia::render('teams/show', [
        'team' => $team,
        'tab' => 'jobs',
        'jobs' => JobPostingResource::collection($team->jobs)
    ]);
})->name('teams.jobs.index');

Route::get('/', function () {
        return Inertia::render('dashboard');
})->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
