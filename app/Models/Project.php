<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    protected $fillable = [
        'title',
        'release_title',
        'description',
        'excerpt',
        'body',
        'platforms',
        'tools',
        'released',
        'released_on',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'platforms' => 'array',
            'tools' => 'array'
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

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
