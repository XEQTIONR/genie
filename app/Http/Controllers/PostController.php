<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PostController extends Controller
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
            $slug = str_replace(' ', '-', strtolower($validated['title'])) . '-' .(++$n);
            $existing = Post::where('slug', $slug)->first();
        }
        

       
        $validated['status'] = 'created';
        $validated['slug'] = $slug;

        $user = User::find(Auth::id());

        $post = new Post($validated);
        $user->posts()->save($post);
        
        return to_route('home');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
