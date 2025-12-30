<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Activity extends Model
{
    use HasUuids;

    protected $fillable = ['content'];


    protected function casts(): array
    {
        return [
            'content' => 'array'
        ];
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
