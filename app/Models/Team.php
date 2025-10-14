<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{

    protected $fillable = [
        'name',
        'description',
        'slug',
    ];

    protected function casts()
    {
        return [
            'meta' => 'array'
        ];
    }
}
