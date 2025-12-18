<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('owner')->withCount(['likes', 'views'])->get();
        
        $posts->load(['likes' => function(MorphMany $query) {
            $query->where('user_id', Auth::id());
        }]);

        return Inertia::render('posts/index', [
            'posts' => $posts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('posts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'cover' => 'required|string',
            'cover_type' => 'required|string',
            'body' => 'nullable|array',
        ]);

        $slug = str_replace(' ', '-', strtolower($validated['title']));
        
        $existing = Post::where('slug', $slug)->first();
        $n = 0;

        while ($existing) {
            $slug = str_replace(' ', '-', strtolower($validated['title'])) . '-' . (++$n);
            $existing = Post::where('slug', $slug)->first();
        }

        $validated['status'] = 'created';
        $validated['slug'] = $slug;

        $user = User::find(Auth::id());

        $post = new Post([
            ...$validated,
            'owner_type' => User::class,
            'owner_id' => $user->id,
        ]);
        $user->posts()->save($post);
        
        return to_route('home');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return Inertia::render('posts/show', [
            'post' => $post
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
        return Inertia::render('posts/edit', [
            'post' => $post
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'cover' => 'required|string',
            'cover_type' => 'required|string',
            'body' => 'nullable|array',
        ]);

        $post->title = $validated['title'];
        $post->cover = $validated['cover'];
        $post->cover_type = $validated['cover_type'];
        $post->body = $validated['body'];

        $post->save();

        return to_route('posts.show', ['post' => $post]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
