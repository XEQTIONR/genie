<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Post;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LikeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'likeable_id' => 'required|numeric',
            'likeable_type' => 'required|string|in:post,project,user'
        ]);

        $id = Auth::id();
        $type = match ($validated['likeable_type']) {
            'post' => Post::class,
            'project' => Project::class,
            'user' => User::class,
        };        

        $like = Like::where('likeable_id', $validated['likeable_id'])
            ->where('likeable_type', $type)
            ->where('user_id', $id)
            ->first();
        
        if (!$like) {
            $l = new Like([
                'likeable_id' => $validated['likeable_id'],
                'likeable_type' => $type,
                'user_id' => $id
            ]);

            $l->save();
            return $l;
        }

        return $like;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Like $like)
    {
        $like->load(['user']);

        if ($like->user->id === Auth::id()) {
            $like->delete();
        }
    }
}
