<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Project;
use App\Models\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ViewController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'viewable_id' => 'required|numeric',
            'viewable_type' => 'required|string|in:post,project'
        ]);

        $id = Auth::id();
        $type = match ($validated['viewable_type']) {
            'post' => Post::class,
            'project' => Project::class,
        };

        $view = View::where('viewable_id', $validated['viewable_id'])
            ->where('viewable_type', $type)
            ->where('user_id', $id)
            ->first();

        if (!$view) {
            $v = new View([
                'viewable_id' => $validated['viewable_id'],
                'viewable_type' => $type,
                'user_id' => $id
            ]);

            $v->save();
            return $v;
        }

        return $view;
    }
}
