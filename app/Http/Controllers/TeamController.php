<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\Upload;
use App\Models\User;
use App\Notifications\TeamInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
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
        return Inertia::render('teams/index', [
            'teams' => Team::all(),
            //'user_count' => $team->users()->count()
        ]);
    }


    public function show(Team $team)
    {
        return Inertia::render('teams/show', [
            'team' => $team,
            'user_count' => $team->users()->count()
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

        $existing_users = Arr::where($validated['members'], fn(array $value) => Arr::has($value, 'id'));
        $new_users = Arr::where($validated['members'], fn(array $value) => !Arr::has($value, 'id'));
        $keyed = Arr::mapWithKeys($existing_users, fn(array $item) => [$item['id'] => $item['roles']]);

        $users = User::whereIn('id', array_keys($keyed))->get();

        foreach ($existing_users as $invitee)
        {
            if ($userId == $invitee['id']) {
                $team->users()->save($user, ['roles' => $invitee['roles']]);
            } else {
                $invitation = new TeamInvitation([
                    'team_id' => $team->id,
                    'inviter_id' => $userId,
                    'invitee_id' => $invitee['id'],
                    'to_email' => $users->first(fn($value) => $value['id'] === $invitee['id'])->email,
                    'roles' => $invitee['roles'],
                ]);

                $invitation->save();

                Notification::route('mail', $invitation->to_email)
                    ->notify(new TeamInvitationNotification($invitation));
            }
        }
        
        foreach ($new_users as $invitee)
        {
            $invitation = new TeamInvitation([
                'team_id' => $team->id,
                'inviter_id' => $userId,
                'to_email' => $invitee['email'],
                'roles' => $invitee['roles'],
            ]);

            $invitation->save();

            Notification::route('mail', $invitation->to_email)
                ->notify(new TeamInvitationNotification($invitation));
        }

        return to_route('teams.show', ['team' => $team]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'field' => 'required|string|in:avatar,banner'
        ]);

        switch ($validated['field']) {
            case 'avatar':
                return $this->updateAvatar($request, $team);
            case 'banner':
                return $this->updateBanner($request, $team);
        }
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
}
