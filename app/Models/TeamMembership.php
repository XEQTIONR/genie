<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TeamMembership extends Pivot
{
    protected $table = 'team_user';

    protected function casts(): array
    {
        return [
            'roles' => 'array',
        ];
    }
}
