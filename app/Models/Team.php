<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Notifications\Action;

class Team extends Model
{
    /** @use HasFactory<\Database\Factories\TeamFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'slug',
        'creator_id',
        'owner_id',
        'avatar',
        'locations',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'locations' => 'array',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(TeamMembership::class)
            ->withPivot(['roles', 'permissions'])
            ->withTimestamps();
    }

    public function projects(): MorphMany
    {
        return $this->morphMany(Project::class, 'owner');
    }

    public function posts(): MorphMany
    {
        return $this->morphMany(Post::class, 'owner');
    }

    public function opportunities(): MorphMany
    {
        return $this->morphMany(Opportunity::class, 'owner');
    }

    public function activities(): MorphMany
    {
        return $this->morphMany(Activity::class, 'subject')
            ->orderByDesc('created_at');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(TeamInvitation::class);
    }
}
