<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectMembership extends Pivot
{
    protected $table = 'project_user';

    protected function casts(): array
    {
        return [
            'roles' => 'array',
        ];
    }
}
