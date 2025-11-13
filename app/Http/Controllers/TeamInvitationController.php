<?php

namespace App\Http\Controllers;

use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamInvitationController extends Controller
{

    public function show(TeamInvitation $invitation)
    {   
        $invitation->load(['team', 'inviter']);
        return Inertia::render('invitations/team', [
            'invitation' => $invitation,
        ]);
    }
}
