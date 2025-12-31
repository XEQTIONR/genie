<?php

namespace App\Http\Controllers;

use App\Models\Activity;
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

        $content = [];

        if ($validated['owner_type'] == Team::class) {
            $content = [
                'owner_type' => 'team',
                'owner_id' => intval($validated['owner_id']),
            ];
        } else {
            $content = [
                'owner_type' => 'user',
                'owner_id' => intval($validated['owner_id']),
            ];
        }

        $activity = new Activity([
            'type' => 'create-project',
            'user_id' => Auth::id(),
            'content' => $content
        ]);

        $project->activities()->save($activity);

        return to_route('projects.members.create', ['project' => $project]);
}

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $user = Auth::user();

        if ($project->visibility === 'private') 
        {
            if (! $user) 
            {
                session()->put('url.intended', URL::full());
                return redirect(route('login'));
            }
            
            if (! Gate::allows('view-project', $project)) 
            {
                abort(403);
            }
        }

        $project->load([
            'owner', 
            'creator', 
            'members',
            'likes' => function(MorphMany $query) {
                $query->where('user_id', Auth::id());
            }
        ])->withCount(['likes', 'views']);

        $owns = false;

        if ($user) 
        {
            if ($project->owner_id == $user->id && $project->owner_type === User::class) 
            {
                $owns = true;
            } 
            else if ($project->owner_type === Team::class) 
            {
                //Project->Team->User
                $owner = $project->owner->owner;
                if ($owner->id == $user->id) {
                    $owns = true;
                }
            }
        }
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
            'owns' => $owns,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $user = Auth::user();

        $project->load('owner');

        $teams = $user->teams;

        return Inertia::render('projects/edit', compact('project', 'user', 'teams'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
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

        $project->title = $validated['title'];
        $project->excerpt = $validated['excerpt'];
        $project->description = $validated['description'];
        $project->owner_type = $validated['owner_type'];
        $project->owner_id = $validated['owner_id'];
        $project->visibility = $validated['visibility'];
        $project->platforms = $validated['platforms'];
        $project->cover_media = $validated['cover_media'];

        $project->save();

        return to_route('projects.show', ['project' => $project]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
