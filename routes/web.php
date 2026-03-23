<?php

use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\OpportunityInquiryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectInvitationController;
use App\Http\Controllers\ProjectMembershipController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\TeamMembershipController;
use App\Http\Controllers\TeamSettingsController;
use App\Http\Controllers\UserProfileController;
use App\Http\Resources\OpportunityResource;
use App\Models\Post;
use App\Models\Team;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::get('/teams/create', [TeamController::class, 'create'])->name('teams.create');
    
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::get('/projects/{project:slug}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::get('/projects/{project:slug}/members/create', [ProjectMembershipController::class, 'create'])
        ->name('projects.members.create');
    Route::get('/projects/{project:slug}/settings/members', [ProjectMembershipController::class, 'editMembers'])
        ->name('projects.members.editMembers');
    Route::get('/projects/{project:slug}/members/{member}/edit', [ProjectMembershipController::class, 'edit'])
        ->name('projects.members.edit');
    Route::post('/projects/{project:slug}/members', [ProjectMembershipController::class, 'store'])
        ->name('projects.members.store');

    Route::get('/opportunities/create', [OpportunityController::class, 'create'])->name('opportunities.create');
    Route::post('/opportunities', [OpportunityController::class, 'store'])->name('opportunities.store');

    Route::patch('/profile/{user}', [UserProfileController::class, 'update'])->name('users.update');

    Route::patch('/teams/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::get('/teams/{team:slug}/settings', [TeamController::class, 'edit'])->name('teams.edit');
    Route::get('/teams/{team:slug}/settings/members', [TeamSettingsController::class, 'editMembers'])->name('teams.edit.members');
    Route::post('/teams/{team}/settings/members/{user}', [TeamMembershipController::class, 'update'])->name('teams.edit.members.update');
    Route::get('/teams/{team:slug}/settings/opportunities', [TeamSettingsController::class, 'editOpportunities'])->name('teams.edit.opportunities');

    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
});

Route::get('/opportunities', [OpportunityController::class, 'index'])->name('opportunities.index');
Route::get('/opportunities/{opportunity}', [OpportunityController::class, 'show'])->name('opportunities.show');
Route::get('/opportunities/{opportunity}/edit', [OpportunityController::class, 'edit'])->name('opportunities.edit');
Route::put('/opportunities/{opportunity}', [OpportunityController::class, 'update'])->name('opportunities.update');
Route::post('/opportunities/{opportunity}/inquiry', [OpportunityInquiryController::class, 'store'])->name('opportunities.inquiries.store');


Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/projects/{project:slug}/activities', [ProjectController::class, 'showActivity'])->name('projects.activites.index');
Route::get('/projects/{project:slug}/showcase', [ProjectController::class, 'showPosts'])->name('projects.posts.index');

Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
Route::get('/teams/{team:slug}', [TeamController::class, 'show'])->name('teams.show');
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
    $projects = $team->projects()
    ->with('owner')
    ->withCount(['likes', 'views'])
    ->get();

    return Inertia::render('teams/show', [
        'team' => $team,
        'projects' => $projects,
        'user_count' => $team->users()->count(), // cache this later
        'tab' => 'projects'
    ]);
})->name('teams.projects.index');

Route::get('/teams/{team:slug}/activities', [TeamController::class, 'showActivity'])->name('teams.activities.index');

Route::get('/users', [UserProfileController::class, 'index'])->name('users.index');


Route::get('/projects/invitations/{invitation}', [ProjectInvitationController::class, 'show'])->name('projectInvitation.show');
Route::put('/projects/invitations/{invitation}', [ProjectInvitationController::class, 'update'])->name('projectInvitation.update');
Route::get('/teams/invitations/{invitation}', [TeamInvitationController::class, 'show'])->name('teamInvitation.show');
Route::put('/teams/invitations/{invitation}', [TeamInvitationController::class, 'update'])->name('teamInvitation.update');

Route::get('/profile/{user:username}', [UserProfileController::class, 'show'])->name('users.show');
Route::get('/profile/{user:username}/about', [UserProfileController::class, 'about'])->name('users.about');
Route::get('/profile/{user:username}/teams', [UserProfileController::class, 'teams'])->name('users.teams.index');
Route::get('/profile/{user:username}/projects', [UserProfileController::class, 'projects'])->name('users.projects.index');
Route::get('/profile/{user:username}/activities', [UserProfileController::class, 'activities'])->name('users.activites.index');

Route::get('/teams/{team:slug}/opportunities', function (Team $team) {
    return Inertia::render('teams/show', [
        'team' => $team,
        'tab' => 'jobs',
        'opportunities' => OpportunityResource::collection($team->opportunities),
    ]);
})->name('teams.opportunities.index');

Route::get('/', function () {
    $posts = Post::with('owner')->withCount(['likes', 'views'])->get();
    $posts->load(['likes' => function($query) {
        $query->where('user_id', Auth::id());
    }]);

    return Inertia::render('dashboard', [
        'posts' => $posts
    ]);
})->name('home');

Route::get('/test', function () {
    return Inertia::render('tst');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
