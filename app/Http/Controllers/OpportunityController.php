<?php

namespace App\Http\Controllers;

use App\Http\Resources\OpportunityResource;
use App\Models\Activity;
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
        return Inertia::render('jobs/index', ['opportunities' => OpportunityResource::collection(Opportunity::all())]);
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
            'multiple' => 'required|boolean',
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
            'description' => 'required|string',
            'expires_at' => 'nullable|date'
        ]);

        $job = new Opportunity([
            'title' => $validated['title'],
            'publish' => $validated['publish'],
            'multiple' => $validated['multiple'],
            'primary_role' => $validated['primary_role'],
            'location_type' => $validated['location_type'],
            'locations' => count($validated['locations']) > 0 ? $validated['locations'] : null,
            'tags' => count($validated['tags']) > 0 ? $validated['tags'] : null,
            'work_location' => $validated['work_location'],
            'employment_type' => $validated['employment_type'],
            'compensation_type' => $validated['compensation_type'],
            'description' => $validated['description_html'],
            'expires_at' => $validated['expires_at'],
            'creator_id' => Auth::id(),
        ]);

        if ($validated['owner_type'] == 'project') {
            $project = Project::find($validated['owner_id']);
            $project->opportunities()->save($job);

            if ($validated['publish']) {
                $activity = new Activity([
                    'type' => 'create-job',
                    'user_id' => Auth::id(),
                    'content' => [
                        'id' => $job->id,
                        'title' => $job->title
                    ]
                ]);

                $project->activities()->save($activity);
            }

        } else { // $validated['owner_type'] == 'team'
            $team = Team::find($validated['owner_id']);
            $team->opportunities()->save($job);

            if ($validated['publish']) {
                $activity = new Activity([
                    'type' => 'create-job',
                    'user_id' => Auth::id(),
                    'content' => [
                        'id' => $job->id,
                        'title' => $job->title
                    ]
                ]);

                $team->activities()->save($activity);
            }
        }

        return to_route('home');
    }

    /**
     * Display the specified resource.
     */
    public function show(Opportunity $opportunity)
    {
        $opportunity->load(['creator']);
        return Inertia::render('jobs/show', [
            'job' => new OpportunityResource($opportunity)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Opportunity $opportunity)
    {
        return Inertia::render('jobs/edit', [
            'teams' => Auth::user()->teams,
            'projects' => Auth::user()->ownedProjects,
            'job' => $opportunity
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Opportunity $opportunity)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:5',
            'publish' => 'required|boolean',
            'multiple' => 'required|boolean',
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
            'description' => 'required|string',
            'expires_at' => 'nullable|date'
        ]);

        $opportunity->title = $validated['title'];
        $opportunity->publish = $validated['publish'];
        $opportunity->primary_role = $validated['primary_role'];
        $opportunity->location_type = $validated['location_type'];
        $opportunity->locations = $validated['locations'];
        $opportunity->tags = $validated['tags'];
        $opportunity->work_location = $validated['work_location'];
        $opportunity->employment_type = $validated['employment_type'];
        $opportunity->compensation_type = $validated['compensation_type'];
        $opportunity->expires_at = $validated['expires_at'] ?? null;
        $opportunity->multiple = $validated['multiple'];
        //$opportunity->description_html = $validated['description_html'];
        $opportunity->description = $validated['description_html'];

        if ($validated['owner_type'] == 'project') {
            $project = Project::find($validated['owner_id']);
            $project->opportunities()->save($opportunity);

            // if ($validated['publish']) {
                $activity = new Activity([
                    'type' => 'update-job',
                    'user_id' => Auth::id(),
                    'content' => [
                        'id' => $opportunity->id,
                        'title' => $opportunity->title
                    ]
                ]);

                $project->activities()->save($activity);
            // }

        } else { // $validated['owner_type'] == 'team'
            $team = Team::find($validated['owner_id']);
            $team->opportunities()->save($opportunity);

            // if ($validated['publish']) {
                $activity = new Activity([
                    'type' => 'update-job',
                    'user_id' => Auth::id(),
                    'content' => [
                        'id' => $opportunity->id,
                        'title' => $opportunity->title
                    ]
                ]);

                $team->activities()->save($activity);
            // }
        }

        return to_route('opportunities.show', compact('opportunity'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
