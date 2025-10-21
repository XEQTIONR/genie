<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserProfileController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'field' => 'required|string|in:status,bio,location,fav_games,skills,contact,socials',
        ]);

        switch ($validated['field']) {
            case 'status':
                return $this->updateStatus($request, $user);
            case 'bio':
                return $this->updateBio($request, $user);
            default:
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    protected function updateStatus(Request $request, User $user)
    {
        $validated = $request->validateWithBag('userInfo', [
            'status' => 'nullable|string|max:50|min:5'
        ]);

        $user->status = $validated['status'];
        $user->save();

        return to_route('users.about', [
            'user' => $user
        ])->with('notification', [
            'type' => 'info',
            'message' => "Status updated",
            'button' => null
        ]);
    }

    protected function updateBio(Request $request, User $user)
    {
        $validated = $request->validate([
            'bio' => 'nullable|string|max:500'
        ]);

        $user->bio = $validated['bio'];
        $user->save();

        return to_route('users.about', [
            'user' => $user
        ])->with('notification', [
            'type' => 'info',
            'message' => "Bio updated",
            'button' => null
        ]);
    }
}
