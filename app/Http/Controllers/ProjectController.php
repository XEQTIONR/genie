<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        $teams = $user->teams;

        return Inertia::render('projects/create', compact('user', 'teams'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('request');
        Log::info($request);

        $validated = $request->validate([
            'title' => 'required|string|max:50',
            'excerpt' => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'owner_type' => 'required|in:user,team',
            'owner_id' => 'required|integer',
            'visibility' => 'required|in:public,private',
            'platforms' => 'required|array',
        ]);

        $validated['owner_type'] = match ($validated['owner_type']) {
            'user' => User::class,
            'team' => Team::class,
        };

        $validated['platforms'] = array_filter($validated['platforms'], fn($platform) => $platform !== NULL);
        
        if ($validated['platforms'] === []) {
            $validated['platforms'] = NULL;
        }

        Log::info('validated');
        Log::info($validated);

        $project = new Project([
            ...$validated,
            'creator_id' => Auth::id()
        ]);

        $project->save();

        return to_route('home');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
