<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with(['creator', 'owner'])->withCount(['likes', 'views'])->get();

        $projects->load(['likes' => function(MorphMany $query) {
            $query->where('user_id', Auth::id());
        }]);

        return Inertia::render('projects/index', ['projects' => $projects]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        $teams = $user->teams;

        return Inertia::render('projects/create', compact('user', 'teams'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:50',
            'excerpt' => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'owner_type' => 'required|in:user,team',
            'owner_id' => 'required|integer',
            'visibility' => 'required|in:public,private',
            'platforms' => 'required|array',
            'cover_media' => 'required|array|min:1'
        ]);

        $validated['owner_type'] = match ($validated['owner_type']) {
            'user' => User::class,
            'team' => Team::class,
        };

        $validated['platforms'] = [...array_filter($validated['platforms'], fn($platform) => $platform !== NULL)];
        
        if ($validated['platforms'] === []) {
            $validated['platforms'] = NULL;
        }

        $pieces = explode(' ', Str::lower($validated['title']));
        $pieces = preg_replace('/[^\w]/', '', $pieces);
        $slug = implode('-', $pieces);
        $slug = preg_replace('/--+/', '-', $slug);
        $base = $slug;
        $number = 1;
        
        while(Team::where('slug', $slug)->first()) {
            $slug = $base . '-' . $number++;
        }

        $project = new Project([
            ...$validated,
            'slug' => $slug,
            'creator_id' => Auth::id()
        ]);

        $project->save();

        return to_route('projects.members.create', ['project' => $project]);
}

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        if ($project->visibility === 'private') {
            if (! Auth::user()) {
                session()->put('url.intended', URL::full());
                return redirect(route('login'));
            }
            
            if (! Gate::allows('view-project', $project)) {
                abort(403);
            }
        }

        $project->load(['owner', 'creator', 'members'])->withCount(['likes', 'views']);

        $project->load(['likes' => function(MorphMany $query) {
            $query->where('user_id', Auth::id());
        }]);

        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($project->description, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $h = [];
        $tags = ['h1', 'h2'];
        
        foreach($tags as $tag) {
            $searchOffset = 0;
            foreach ($dom->getElementsByTagName($tag) as $t) {
                $fragment = $t->ownerDocument->saveXML($t);
                $offset = strpos($project->description, $fragment, $searchOffset);

                if ($offset !== false) {
                    $searchOffset = $offset;
                }

                $h[] = [
                    'tag' => $tag,
                    'text' => $t->textContent,
                    'offset' => $offset,
                    'hash' => hash('crc32', $t->textContent)
                ];
            }
        }
        
        usort($h, fn($a, $b) => $a['offset'] > $b['offset']);

        foreach($tags as $tag) {
            foreach ($dom->getElementsByTagName($tag) as $t) {
                $t->setAttribute('id', hash('crc32', $t->textContent));
            }
        }

        foreach($dom->getElementsByTagName('iframe') as $t) {
            $class = $t->getAttribute('class');
            $t->setAttribute('class', $class . ' w-full aspect-video');
        }

        $project->description = $dom->saveHTML();

        return Inertia::render('projects/show', [
            'project' => $project,
            'h' => $h,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
