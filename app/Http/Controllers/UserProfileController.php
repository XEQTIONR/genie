<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

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
        Log::info($request);
        
        $validated = $request->validate([
            'field' => 'required|string|in:status,bio,location,fav_games,skills,contact,socials,avatar',
        ]);

        switch ($validated['field']) {
            case 'status':
                return $this->updateStatus($request, $user);
            case 'bio':
                return $this->updateBio($request, $user);
            case 'location':
                return $this->updateLocation($request, $user);
            case 'fav_games':
                return $this->updateFavoriteGames($request, $user);
            case 'skills':
                return $this->updateSkills($request, $user);
            case 'avatar':
                return $this->updateAvatar($request, $user);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    protected function updateAvatar(Request $request, User $user)
    {
        $validated = $request->validateWithBag('userInfo', [
            'avatar' => 'nullable|string'
        ]);

        $user->avatar = $validated['avatar'];
        $user->save();

        return to_route('users.about', [
            'user' => $user
        ])->with('notification', [
            'type' => 'info',
            'message' => "Avatar updated.",
            'button' => null
        ]);
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
            'message' => "Status updated.",
            'button' => null
        ]);
    }

    protected function updateBio(Request $request, User $user)
    {
        $validated = $request->validateWithBag('userInfo', [
            'bio' => 'nullable|string|max:500|min:5'
        ]);

        $user->bio = $validated['bio'];
        $user->save();

        return to_route('users.about', [
            'user' => $user
        ])->with('notification', [
            'type' => 'info',
            'message' => "Bio updated.",
            'button' => null
        ]);
    }

    protected function updateLocation(Request $request, User $user)
    {
        $validated = $request->validateWithBag('userInfo', [
            'city' => 'nullable|string|max:20',
            'country' => 'nullable|string|required_with:city',
        ]);

        if ($validated['city'] === null && $validated['country'] === null) {
            $user->location = null;
        } else {
            $user->location = $validated;
        }

        $user->save();

        return to_route('users.about', [
            'user' => $user
        ])->with('notification', [
            'type' => 'info',
            'message' => "Location updated.",
            'button' => null
        ]);
    }

    protected function updateFavoriteGames(Request $request, User $user)
    {
        $validated = $request->validateWithBag('userInfo', ['fav_games' => [
            'list',
            Rule::doesntContain([null, ''])
        ]], [
            'fav_games.doesnt_contain' => 'Field cannot be empty'
        ]);
        $meta = $user->meta;

        if (!$meta) { // existing meta is empty
            $meta = [];
        }
        
        if (! array_key_exists('fav_games', $validated)) { // no fav games input
            unset($meta['fav_games']);
        } else {
            $meta['fav_games'] = $validated['fav_games'];
        }

        $user->meta = $meta;

        if ($meta == []) { // if existing meta is still empty
            $user->meta = null;
        }

        $user->save();

        return to_route('users.about', [
            'user' => $user
        ])->with('notification', [
            'type' => 'info',
            'message' => "Favorite games updated.",
            'button' => null
        ]);
    }

    protected function updateSkills(Request $request, User $user)
    {
        $validated = $request->validateWithBag('userInfo', ['skills' => [
            'nullable',
            'list',
            Rule::doesntContain([null, ''])
        ]]);

        $meta = $user->meta;

        if (!$meta) { // existing meta is empty
            $meta = [];
        }
        
        if (! array_key_exists('skills', $validated)) { // no fav games input
            unset($meta['skills']);
        } else {
            $meta['skills'] = $validated['skills'];
        }

        $user->meta = $meta;

        if ($meta == []) { // if existing meta is still empty
            $user->meta = null;
        }

        $user->save();

        return to_route('users.about', [
            'user' => $user
        ])->with('notification', [
            'type' => 'info',
            'message' => "Skills updated.",
            'button' => null
        ]);
    }
}
