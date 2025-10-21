<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validateWithBag('newTeam', [
            'name' => 'required|string|min:2',
            'description' => 'nullable|string',
        ]);

        $slug = preg_replace('/[^\w]/', '', Str::lower($validated['name']));
        $number = 1;

        while(Team::where('slug', $slug)->first()) {
            $slug = preg_replace('/[^\w]/', '', Str::lower($validated['name'])) . $number++;
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

        $user->teams()->save($team);

        return redirect(route('users.teams.index', [ 'user' => $user ]))->with('notification', [
            'type' => 'info',
            'message' => "New team created - $team->name",
            'button' => null
        ]);
    }
}
