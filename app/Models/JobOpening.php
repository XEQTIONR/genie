<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class JobOpening extends Model
{
    use HasUuids;

    protected $table = 'job_postings';
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
        'status'
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
}
