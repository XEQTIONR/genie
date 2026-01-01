<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamSettingsController extends Controller
{

    public function editMembers(Team $team)
    {
        $team->load('users');

        return Inertia::render('teams/settings', [
            'team' => $team,
            'tab' => 'members'
        ]);
    }
}
