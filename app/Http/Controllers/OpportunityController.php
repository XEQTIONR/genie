<?php

namespace App\Http\Controllers;

use App\Http\Resources\OpportunityResource;
use App\Models\Opportunity;
use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OpportunityController extends Controller
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
        return Inertia::render('jobs/create', [
            'teams' => Auth::user()->teams,
            'projects' => Auth::user()->ownedProjects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:5',
            'publish' => 'required|boolean',
            'primary_role' => 'nullable|string',
            'location_type' => 'required|string|in:global,specific',
            'locations' => 'required_if:location_type,specific|array',
            'tags' => 'array',
            'work_location' => 'required|array|min:1',
            'employment_type' => 'required|array|min:1',
            'compensation_type' => 'required|string|in:compensated,ownership,credited,voluntary',
            //'compensation' => 'nullable|string',
            'owner_type' => 'required|string|in:project,team',
            'owner_id' => 'required|integer',
            'description_html' => 'required|string',
            'description' => 'required|string'
        ]);

        $job = new Opportunity([
            'title' => $validated['title'],
            'publish' => $validated['publish'],
            'primary_role' => $validated['primary_role'],
            'location_type' => $validated['location_type'],
            'locations' => count($validated['locations']) > 0 ? $validated['locations'] : null,
            'tags' => count($validated['tags']) > 0 ? $validated['tags'] : null,
            'work_location' => $validated['work_location'],
            'employment_type' => $validated['employment_type'],
            'compensation_type' => $validated['compensation_type'],
            'description' => $validated['description_html'],
            'creator_id' => Auth::id(),
        ]);

        if ($validated['owner_type'] == 'project') {
            $project = Project::find($validated['owner_id']);
            $project->opportunities()->save($job);
        } else { // $validated['owner_type'] == 'team'
            $team = Team::find($validated['owner_id']);
            $team->opportunities()->save($job);
        }

        return to_route('home');
    }

    /**
     * Display the specified resource.
     */
    public function show(Opportunity $job)
    {
        $job->load(['creator']);
        return Inertia::render('jobs/show', [
            'job' => new OpportunityResource($job)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
