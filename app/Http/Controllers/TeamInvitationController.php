<?php

namespace App\Http\Controllers;

use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class TeamInvitationController extends Controller
{

    public function show(TeamInvitation $invitation)
    {   
        $invitation->load(['team', 'inviter', 'invitee']);
        $mine = false;

        $user = Auth::user();

        if ($user) {
            $mine = $user->id == $invitation->invitee_id || $user->email == $invitation->to_email;
        }
        session()->put('url.intended', URL::full());

        return Inertia::render('invitations/team', [
            'invitation' => $invitation,
            'mine' => $mine
        ]);
    }

    public function update(TeamInvitation $invitation)
    {
        
    }
}
