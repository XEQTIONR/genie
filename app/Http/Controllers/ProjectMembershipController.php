<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Arr;

class ProjectMembershipController extends Controller
{
    public function create(Project $project)
    {
        $owner = $project->owner;
        
        $default_members = [];

        if ($owner instanceof Team) {
            $default_members = $owner->users;
        } else {
            $default_members = [$owner];
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

        $existing_users = Arr::where($validated['members'], fn(array $value) => Arr::has($value, 'id'));
        $invitees = Arr::where($validated['members'], fn(array $value) => !Arr::has($value, 'id'));
        $keyed = Arr::mapWithKeys($existing_users, fn(array $item) => [$item['id'] => $item['roles']]);

        $users = User::whereIn('id', array_keys($keyed))->get();
        $roles = $users->map(fn(User $user) => ['roles' => $keyed[$user->id]]);

        $project->members()->saveMany($users, $roles->toArray());

        return redirect(route('projects.show', ['project' => $project]));
    }
}
