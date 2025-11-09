<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProjectMembershipController extends Controller
{
    public function create(Project $project)
    {
        $owner = $project->owner;
        
        $default_members = [];

        if ($owner instanceof Team) {
            $default_members = $owner->users;
        }

        return Inertia::render('project-members/create', [
            'project' => $project,
            'owner' => $owner,
            'defaultMembers' => $default_members
        ]);
    }
    public function store(Project $project, Request $request)
    {
        $validated = $request->validate([
            'members' => 'required|array'
        ]);

        $attach = [];

        foreach ($validated['members'] as $member) {
            $attach[$member['id']] = ['role' => $member['role']];
        }


        $project->members()->attach($attach);

        return redirect(route('projects.show', ['project' => $project]));
    }
}
