<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;

class TeamMembershipController extends Controller
{
    public function update(Team $team, User $user, Request $request)
    {
        $validated = $request->validate([
            'roles' => 'required|array|min:0',
            'permissions' => 'required|array|min:0'
        ]);

        if ($team->users()->where('id', $user->id)->first()) 
        {
            $team->users()->syncWithoutDetaching([                
                $user->id => [
                    'roles' => $validated['roles'],
                    'permissions' => $validated['permissions'],
                ]
            ]);
        }

        return to_route('teams.edit.members', [
            'team' => $team
        ]);
    } 
}
