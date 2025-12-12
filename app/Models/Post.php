<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    //

    protected $fillable = [
        'slug',
        'cover',
        'cover_type',
        'body',
        'num_likes',
        'num_views',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'body' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
