<?php

namespace App\Http\Controllers;

use App\Models\ProjectInvitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class ProjectInvitationController extends Controller
{
    public function show(ProjectInvitation $invitation)
    {
        $invitation->load(['project', 'inviter', 'invitee']);
        $mine = false;

        $user = Auth::user();

        if ($user) {
            $mine = $user->id == $invitation->invitee_id || $user->email == $invitation->to_email;
        }

        session()->put('url.intended', URL::full());

        return Inertia::render('invitations/project', [
            'invitation' => $invitation,
            'mine' => $mine,
        ]);
    }

    public function update(ProjectInvitation $invitation)
    {
        $project = $invitation->project;
        $roles = $invitation->roles;
        $user = User::where('email', $invitation->to_email)->first();

        $project->members()->save($user, ['roles' => $roles]);

        return to_route('projects.show', ['project' => $project]);
    }
}
