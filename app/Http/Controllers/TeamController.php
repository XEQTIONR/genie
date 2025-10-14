<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
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
            'name' => 'required|string|regex:/^[a-zA-Z0-9\s]+$/|min:2',
            'description' => 'nullable|string',
        ], ['name.regex' => 'The name field can only contain letters, numbers and spaces']);

        $slug = preg_replace('/[^\w]/', '', Str::lower($validated['name']));
        $number = 1;

        while(Team::where('slug', $slug)->first()) {
            $slug = preg_replace('/[^\w]/', '', Str::lower($validated['name'])) . $number++;
        }
        
        $team = new Team([
            ...$validated,
            'slug' => $slug,
        ]);
        $team->save();

        return redirect(route('home'))->with('notification', [
            'type' => 'info',
            'message' => "New team created - $team->name",
            'button' => null
        ]);
    }
}
