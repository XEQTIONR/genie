<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'comment' => 'required|string|min:1',
            'commentable_type' => 'required|in:post,project',
            'commentable_id' => 'required'
        ]);

        $comment = new Comment([
            'comment' => $validated['comment'],
            'user_id' => Auth::id()
        ]);

        switch($validated['commentable_type']) {
            case 'project':
                $project = Project::find($validated(['commentable_id']));
                $project->comments()->save($comment);
                break;

            case 'post':
            default:
                $post = Post::find($validated['commentable_id']);
                $post->comments()->save($comment);
        }
        $comment->load('user');
        return $comment;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
