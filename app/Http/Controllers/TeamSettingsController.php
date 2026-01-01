<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamSettingsController extends Controller
{
    public function edit(Team $team)
    {
        return Inertia::render('teams/settings', [
            'team' => $team
        ]);
    }
}
