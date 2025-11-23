<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Opportunity extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'publish',
        'primary_role',
        'location_type',
        'locations',
        'tags',
        'work_location',
        'employment_type',
        'description',
        'compensation_type',
        'status',
        'creator_id',
    ];

    protected function casts(): array
    {
        return [
            'publish' => 'boolean',
            'locations' => 'array',
            'tags' => 'array',
            'work_location' => 'array',
            'employment_type' => 'array',
        ];
    }

    public function owner(): MorphTo
    {
        return $this->morphTo();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
