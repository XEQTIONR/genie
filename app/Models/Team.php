<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Team extends Model
{

    protected $fillable = [
        'name',
        'description',
        'slug',
        'creator_id',
        'owner_id',
    ];

    protected function casts()
    {
        return [
            'meta' => 'array'
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
}
