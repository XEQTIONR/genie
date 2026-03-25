<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\Upload;
use App\Models\User;
use App\Notifications\TeamInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $f = fn($query) => $query->where('expires_at', null)
            ->orWhere('expires_at', '>', Carbon::now());

        return Inertia::render('teams/index', [
            'teams' => Team::withCount([
                'projects', 
                'users',
                'opportunities' => $f, 
            ])->with(['opportunities' => $f])->get(),
        ]);
    }


    public function show(Team $team)
    {
        return Inertia::render('teams/show', [
            'team' => $team,
            'user_count' => $team->users()->count(),
            'posts' => $team->posts()->latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('teams/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2',
            'description' => 'nullable|string',
            'members' => 'required|array'
        ]);

        $pieces = explode(' ', Str::lower($validated['name']));
        $pieces = preg_replace('/[^\w]/', '', $pieces);
        $slug = implode('-', $pieces);
        $slug = preg_replace('/--+/', '-', $slug);
        $base = $slug;
        $number = 1;
        
        while(Team::where('slug', $slug)->first()) {
            $slug = $base . '-' . $number++;
        }

        $userId = Auth::id();
        $user = User::find($userId);     

        $team = new Team([
            ...$validated,
            'slug' => $slug,
            'avatar' => 'https://api.dicebear.com/9.x/shapes/svg?seed=' . $slug,
            'creator_id' => $userId,
            'owner_id' => $userId,
        ]);

        $team->save();

        $activity = new Activity([
            'type' => 'team-created',
            'user_id' => $userId
        ]);

        $team->activities()->save($activity);

        $existing_users = Arr::where($validated['members'], fn(array $value) => Arr::has($value, 'id'));
        $new_users = Arr::where($validated['members'], fn(array $value) => !Arr::has($value, 'id'));
        $keyed = Arr::mapWithKeys($existing_users, fn(array $item) => [$item['id'] => $item['roles']]);

        $users = User::whereIn('id', array_keys($keyed))->get();

        foreach ($existing_users as $invitee)
        {
            if ($userId == $invitee['id']) {
                $team->users()->save($user, [
                    'roles' => $invitee['roles'],
                    'permissions' => $invitee['permissions']
                ]);
            } else {
                $invitation = new TeamInvitation([
                    'team_id' => $team->id,
                    'inviter_id' => $userId,
                    'invitee_id' => $invitee['id'],
                    'to_email' => $users->first(fn($value) => $value['id'] === $invitee['id'])->email,
                    'roles' => $invitee['roles'],
                    'permissions' => $invitee['permissions'],
                ]);

                $invitation->save();

                $invitee_user = User::find($invitee['id']);
                $invitee_user->notify(new TeamInvitationNotification($invitation));
            }
        }
        
        foreach ($new_users as $invitee)
        {
            $invitation = new TeamInvitation([
                'team_id' => $team->id,
                'inviter_id' => $userId,
                'to_email' => $invitee['email'],
                'roles' => $invitee['roles'],
                'permissions' => $invitee['permissions'],
            ]);

            $invitation->save();

            Notification::route('mail', $invitation->to_email)
                ->notify(new TeamInvitationNotification($invitation));
        }

        return to_route('teams.show', ['team' => $team]);
    }

    public function edit(Team $team)
    {
        return Inertia::render('teams/settings', [
            'team' => $team,
            'tab' => 'general'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'field' => 'required|string|in:avatar,banner,general'
        ]);

        switch ($validated['field']) {
            case 'avatar':
                return $this->updateAvatar($request, $team);
            case 'banner':
                return $this->updateBanner($request, $team);
            case 'general':
                return $this->updateGeneral($request, $team);
        }
    }

    public function showActivity(Team $team)
    {
        $activities = Activity::where('subject_type', Team::class)
            ->where('subject_id', $team->id)
            ->orWhere(function($query) use ($team) {
            $query->where('content->owner_id', $team->id)
                ->where('content->owner_type', 'team');
        })->with(['user', 'subject'])
        ->orderByDesc('created_at')
        ->paginate(5);

        return Inertia::render('teams/show', [
            'team' => $team,
            'tab' => 'activity',
            'user_count' => $team->users()->count(),
            'activities' => $activities,
        ]);
    }

    protected function updateAvatar(Request $request, Team $team)
    {
        $validated = $request->validate([
            'avatar' => 'nullable|string'
        ]);

        $old_avatar = $team->avatar;
        $team->avatar = $validated['avatar'];
        $team->save();

        if ($old_avatar) {
            $upload = Upload::where('url', $old_avatar)->first();
            if ($upload) {
                Storage::disk('public')->delete($upload->name);
                $upload->delete();
            }
        }

        return to_route('teams.show', [
            'team' => $team
        ])->with('notification', [
            'type' => 'info',
            'message' => "Avatar updated.",
            'button' => null
        ]);
    }

    protected function updateBanner(Request $request, Team $team)
    {
        Log::info('updateBanner');
        $validated = $request->validate([
            'banner' => 'nullable|string'
        ]);

        $old_banner = $team->banner;
        $team->banner = $validated['banner'];
        $team->save();

        if ($old_banner) {
            $upload = Upload::where('url', $old_banner)->first();
            if ($upload) {
                Storage::disk('public')->delete($upload->name);
                $upload->delete();
            }
        }

        return to_route('teams.show', [
            'team' => $team
        ])->with('notification', [
            'type' => 'info',
            'message' => "Banner updated.",
            'button' => null
        ]);
    }

    protected function updateGeneral(Request $request, Team $team)
    {
        Log::info('updateGeneral');
        Log::info($request);
        $validated = $request->validate([
            'name' => 'required|string|min:2',
            'description' => 'nullable|string',
            'locations' => 'required|json',
            'links' => 'nullable|array|min:1'
        ]);

        $team->name = $validated['name'];
        $team->description = $validated['description'];

        $locations = json_decode($validated['locations']);

        $team->locations = $locations;

        if($locations === []) {
            $team->locations = null;
        }

        if (array_key_exists('links', $validated)) {
            $meta = $team->meta;
            $links = $validated['links'];

            for($i=0; $i<count($links); $i++) {
                if (!Str::startsWith($links[$i], 'https://')) {
                    $links[$i] = 'https://' . $links[$i];
                };
            }
            $meta['links'] = $links;
            $team->meta = $meta;
        } else {
            if ($team->meta) {
                $meta = $team->meta;
                $meta['links'] = null;
                $team->meta = $meta;
            }
        }

        $team->save();

        return to_route('teams.show', [
            'team' => $team
        ])->with('notification', [
            'type' => 'info',
            'message' => "Team information updated.",
            'button' => null
        ]);
    }
}
