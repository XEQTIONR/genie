<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Project extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'release_title',
        'description',
        'excerpt',
        'body',
        'platforms',
        'tools',
        'released',
        'released_on',
        'status',
        'owner_id',
        'owner_type',
        'creator_id',
        'visibility',
        'cover_media',
    ];

    protected function casts(): array
    {
        return [
            'platforms' => 'array',
            'tools' => 'array',
            'released' => 'boolean',
            'cover_media' => 'array'
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function owner(): MorphTo
    {
        return $this->morphTo();
    }

    public function posts(): MorphMany
    {
        return $this->morphMany(Post::class, 'owner');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(ProjectMembership::class)
            ->withPivot(['roles'])
            ->withTimestamps();
    }

    public function opportunities(): MorphMany
    {
        return $this->morphMany(Opportunity::class, 'owner');
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function views(): MorphMany
    {
        return $this->morphMany(View::class, 'viewable');
    }

    public function activities(): MorphMany
    {
        return $this->morphMany(Activity::class, 'subject');
    }
}
