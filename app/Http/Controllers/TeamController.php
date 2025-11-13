<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use App\Notifications\NewUserTeamInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('teams/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2',
            'description' => 'nullable|string',
            'members' => 'required|array'
        ]);

        $pieces = explode(' ', Str::lower($validated['name']));
        $pieces = preg_replace('/[^\w]/', '', $pieces);
        $slug = implode('-', $pieces);
        $slug = preg_replace('/--+/', '-', $slug);
        $base = $slug;
        $number = 1;
        
        while(Team::where('slug', $slug)->first()) {
            $slug = $base . '-' . $number++;
        }

        $userId = Auth::id();
        $user = User::find($userId);     

        $team = new Team([
            ...$validated,
            'slug' => $slug,
            'creator_id' => $userId,
            'owner_id' => $userId,
        ]);

        $team->save();

        $existing_users = Arr::where($validated['members'], fn(array $value) => Arr::has($value, 'id'));
        $invitees = Arr::where($validated['members'], fn(array $value) => !Arr::has($value, 'id'));
        $keyed = Arr::mapWithKeys($existing_users, fn(array $item) => [$item['id'] => $item['roles']]);

        $users = User::whereIn('id', array_keys($keyed))->get();
        $roles = $users->map(fn(User $user) => ['roles' => $keyed[$user->id]]);


        $team->users()->saveMany($users, $roles->toArray());
        
        foreach ($invitees as $invitee)
        {
            $invitation = new TeamInvitation([
                'team_id' => $team->id,
                'inviter_id' => $userId,
                'to_email' => $invitee['email'],
                'roles' => $invitee['roles'],
            ]);

            $invitation->save();

            Notification::route('mail', $invitation->to_email)
                ->notify(new NewUserTeamInvitation($invitation));
        }

        return to_route('teams.show', ['team' => $team]);
    }
}
