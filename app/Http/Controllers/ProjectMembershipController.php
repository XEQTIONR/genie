<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Models\Team;
use App\Models\User;
use App\Notifications\ProjectInvitationNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

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

        $userId = Auth::id();
        $user = User::find($userId);   

        $existing_users = Arr::where($validated['members'], fn(array $value) => Arr::has($value, 'id'));
        $new_users = Arr::where($validated['members'], fn(array $value) => !Arr::has($value, 'id'));
        $keyed = Arr::mapWithKeys($existing_users, fn(array $item) => [$item['id'] => $item['roles']]);

        $users = User::whereIn('id', array_keys($keyed))->get();

        foreach ($existing_users as $invitee)
        {
            if ($userId == $invitee['id']) {
                $project->members()->save($user, [
                    'roles' => $invitee['roles'],
                    'permissions' => $invitee['permissions']
            ]);
            } else {
                $invitation = new ProjectInvitation([
                    'project_id' => $project->id,
                    'inviter_id' => $userId,
                    'invitee_id' => $invitee['id'],
                    'to_email' => $users->first(fn($value) => $value['id'] === $invitee['id'])->email,
                    'roles' => $invitee['roles'],
                    'permissions' => $invitee['permissions']
                ]);

                $invitation->save();
                
                $invitee_user = User::find($invitee['id']);
                $invitee_user->notify(new ProjectInvitationNotification($invitation));
                // Notification::route('mail', $invitation->to_email)
                //     ->notify(new ProjectInvitationNotification($invitation));
            }
        }

        foreach ($new_users as $invitee)
        {
            $invitation = new ProjectInvitation([
                'project_id' => $project->id,
                'inviter_id' => $userId,
                'to_email' => $invitee['email'],
                'roles' => $invitee['roles'],
                'permissions' => $invitee['permissions']
            ]);

            $invitation->save();

            Notification::route('mail', $invitation->to_email)
                    ->notify(new ProjectInvitationNotification($invitation));
        }

        return redirect(route('projects.show', ['project' => $project]));
    }
}
