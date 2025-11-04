<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'visibility'
    ];

    protected function casts(): array
    {
        return [
            'platforms' => 'array',
            'tools' => 'array',
            'released' => 'boolean'
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
}
